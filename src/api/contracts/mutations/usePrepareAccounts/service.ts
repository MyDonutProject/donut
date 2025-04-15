import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { Decimal } from "@/lib/Decimal";
import { ErrorService } from "@/services/error-service";
import { NotificationsService } from "@/services/NotificationService";
import { store } from "@/store";
import { addNotificationToasty } from "@/store/notifications";
import * as anchor from "@project-serum/anchor";
import { Idl, Program } from "@project-serum/anchor";
import { AnchorWallet, Wallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  checkWsolAccount,
  closeWalletOnError,
  phase2_registerUser,
  prepareUplinesForRecursion,
  setupReferrerTokenAccount,
  setupVaultTokenAccount,
} from "./utils";

export async function fetchPrepareAccounts({
  amount,
  connection,
  program,
  wallet,
  anchorWallet,
  notificationService,
}: {
  amount: string;
  connection: Connection;
  program: Program<Idl>;
  wallet: Wallet;
  anchorWallet: AnchorWallet;
  notificationService: NotificationsService<typeof store>;
}) {
  try {
    const toDecimalAmount = new Decimal(amount, { scale: 9 });
    const depositAmount = new anchor.BN(toDecimalAmount.subunits);
    const balance = await connection.getBalance(wallet.adapter.publicKey);

    if (balance < depositAmount.toNumber() + 10000000) {
      // 0.01 SOL para taxas
      throw new Error("Insufficient balance");
    }

    const [referrerAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_account"),
        MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS.toBuffer(),
      ],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    const referrerInfo = await program.account.userAccount.fetch(
      referrerAccount
    );

    const nextSlotIndex = referrerInfo.chain.filledSlots;

    if (nextSlotIndex >= 3) {
      store.dispatch(
        addNotificationToasty({
          id: 1,
          message: "Referrer matrix is already full!",
          type: "error",
        })
      );
      return null;
    }

    const [userAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_account"), wallet.adapter.publicKey.toBuffer()],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    try {
      const userInfo = await program.account.userAccount.fetch(userAccount);
      if (userInfo.isRegistered) {
        notificationService.info({
          title: "already_registered_title",
          message: "already_registered_message",
        });
        return null;
      }
    } catch (e) {}

    // 4. Obter ATA do usuário para WSOL
    const userWsolAccount = await anchor.utils.token.associatedAddress({
      mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
      owner: wallet.adapter.publicKey,
    });

    // 5. Verificar se a conta WSOL já existe e tem saldo suficiente
    const wsolAccountStatus = await checkWsolAccount(
      userWsolAccount,
      connection
    );

    // 6. Preparar uplines para recursividade (se necessário)
    let uplinesData = {
      remainingAccounts: [],
      needsPool: false,
      needsReserve: false,
      needsPayment: false,
    };

    // CORREÇÃO: Determinar as flags com base no referenciador primeiro
    // Isso garante que needsPayment seja true quando preenchemos o slot 2 (índice 3)
    if (referrerInfo.chain.filledSlots === 0) {
      uplinesData.needsPool = true;
    } else if (referrerInfo.chain.filledSlots === 1) {
      uplinesData.needsReserve = true;
    } else if (referrerInfo.chain.filledSlots === 2) {
      uplinesData.needsPayment = true;

      // Preparar uplines para recursividade (apenas se estamos no slot 3)
      if (
        referrerInfo.upline &&
        referrerInfo.upline.upline &&
        referrerInfo.upline.upline.length > 0
      ) {
        try {
          const uplines = referrerInfo.upline.upline;

          if (uplines && uplines.length > 0) {
            // CORREÇÃO: Passar o filledSlots do referenciador para a função
            const recursiveData = await prepareUplinesForRecursion(
              uplines,
              referrerInfo.chain.filledSlots,
              program,
              connection,
              wallet,
              anchorWallet
            );

            // CORREÇÃO: Garantir que needsPayment permaneça true se necessário
            if (referrerInfo.chain.filledSlots === 2) {
              recursiveData.needsPayment = true;
            }

            // Atualizar flags e contas de upline
            uplinesData = recursiveData;
          }
        } catch (e) {
          ErrorService.onError(e);
          return null;
        }
      }
    }

    // 7. Configurar contas de token necessárias
    const programTokenVault = await setupVaultTokenAccount(
      connection,
      wallet,
      anchorWallet
    );

    const referrerTokenAccount = await setupReferrerTokenAccount(
      MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS,
      connection,
      wallet,
      anchorWallet
    );

    // 8. Preparar a conta WSOL com saldo para o depósito
    // Valor mínimo para rent-exempt
    const rentExempt = 2282880;

    // Se a conta WSOL não existe ou não tem saldo suficiente, transferir o valor necessário
    if (
      !wsolAccountStatus.exists ||
      wsolAccountStatus.balance < depositAmount.toNumber()
    ) {
      // 1. Criar a conta ATA
      const createATAIx = new TransactionInstruction({
        keys: [
          {
            pubkey: wallet.adapter.publicKey,
            isSigner: true,
            isWritable: true,
          },
          { pubkey: userWsolAccount, isSigner: false, isWritable: true },
          {
            pubkey: wallet.adapter.publicKey,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: MAIN_ADDRESSESS_CONFIG.ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
      });

      // 2. Transferir o valor do depósito
      // MODIFICAÇÃO IMPORTANTE: Agora transferimos apenas o valor do depósito + rent exempt
      // O contrato espera encontrar este saldo na conta WSOL
      const totalAmount = depositAmount.toNumber() + rentExempt;

      const transferTotalIx = SystemProgram.transfer({
        fromPubkey: wallet.adapter.publicKey,
        toPubkey: userWsolAccount,
        lamports: totalAmount,
      });

      // 3. Sincronizar a conta nativa
      const syncNativeIx = new TransactionInstruction({
        keys: [{ pubkey: userWsolAccount, isSigner: false, isWritable: true }],
        programId: MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID,
        data: Buffer.from([17]), // Comando syncNative
      });

      // Criar a conta WSOL com valor total em uma única transação
      const wsolSetupTx = new Transaction().add(
        createATAIx,
        transferTotalIx,
        syncNativeIx
      );
      wsolSetupTx.feePayer = wallet.adapter.publicKey;

      const { blockhash } = await connection.getLatestBlockhash();

      wsolSetupTx.recentBlockhash = blockhash;

      const signedWsolTx = await anchorWallet.signTransaction(wsolSetupTx);
      const wsolTxid = await connection.sendRawTransaction(
        signedWsolTx.serialize()
      );

      await connection.confirmTransaction(wsolTxid, "confirmed");

      // Verificar o saldo final da conta WSOL
      try {
        const finalTokenInfo = await connection.getTokenAccountBalance(
          userWsolAccount
        );
      } catch (e) {}
    }

    const phase2Data = {
      depositAmount,
      userAccount,
      userWsolAccount,
      referrerAccount,
      referrerTokenAccount,
      programTokenVault,
      uplinesData,
    };

    await phase2_registerUser(
      phase2Data,
      connection,
      wallet,
      anchorWallet,
      program
    );
  } catch (err) {
    notificationService.error({
      title: "error_preparing_accounts_title",
      message: "error_preparing_accounts_description",
    });
    await closeWalletOnError(wallet, anchorWallet, connection);
    throw err;
  }
}
