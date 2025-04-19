import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { Decimal } from "@/lib/Decimal";
import { ErrorService } from "@/services/error-service";
import { NotificationsService } from "@/services/NotificationService";
import { store } from "@/store";
import * as anchor from "@project-serum/anchor";
import { Idl, Program } from "@project-serum/anchor";
import { AnchorWallet, Wallet } from "@solana/wallet-adapter-react";
import {
  AddressLookupTableAccount,
  Connection,
  PublicKey,
  RpcResponseAndContext,
} from "@solana/web3.js";
import {
  closeWalletOnError,
  prepareUplinesForRecursion,
  setupReferrerTokenAccount,
  setupVaultTokenAccount,
  setVersionedTransaction,
} from "./utils";

export async function fetchPrepareAccounts({
  amount,
  connection,
  program,
  wallet,
  anchorWallet,
  notificationService,
  getLookupTableAccount,
}: {
  amount: string;
  connection: Connection;
  program: Program<Idl>;
  wallet: Wallet;
  anchorWallet: AnchorWallet;
  notificationService: NotificationsService<typeof store>;
  getLookupTableAccount: () => Promise<
    RpcResponseAndContext<AddressLookupTableAccount>
  >;
}) {
  try {
    const lookupTableAccount = await getLookupTableAccount();

    if (!lookupTableAccount) {
      notificationService.error({
        title: "error_preparing_accounts_title",
        message: "error_preparing_accounts_description",
      });
      return null;
    }

    const toDecimalAmount = new Decimal(amount, { scale: 9 });
    const depositAmount = new anchor.BN(toDecimalAmount.subunits);
    const balance = await connection.getBalance(wallet.adapter.publicKey);

    if (balance < depositAmount.toNumber() + 10000000) {
      notificationService.error({
        title: "error_preparing_accounts_title",
        message: "error_preparing_accounts_description",
      });
      return null;
    }

    const [referrerAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_account"),
        MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS.toBuffer(),
      ],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );
    let referrerInfo;
    try {
      referrerInfo = await program.account.userAccount.fetch(referrerAccount);

      if (!referrerInfo.isRegistered) {
        console.error("❌ ERRO: O referenciador não está registrado!");
        return;
      }

      // Avisar o slot que será preenchido
      const nextSlotIndex = referrerInfo.chain.filledSlots;
      if (nextSlotIndex >= 3) {
        return;
      }
    } catch (e) {
      console.error("❌ Erro ao verificar referenciador:", e);
      return;
    }
    const nextSlotIndex = referrerInfo.chain.filledSlots;

    if (nextSlotIndex >= 3) {
      notificationService.error({
        title: "error_preparing_accounts_title",
        message: "error_preparing_accounts_description",
      });
      return null;
    }
    const [userAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_account"), wallet.adapter.publicKey.toBuffer()],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    try {
      const userInfo = await program.account.userAccount.fetch(userAccount);
      if (userInfo.isRegistered) {
        return;
      }
    } catch (e) {}

    let remainingAccounts = [];

    const isSlot3 = referrerInfo.chain.filledSlots === 2;

    if (isSlot3 && referrerInfo.upline && referrerInfo.upline.upline) {
      try {
        const uplines = [];
        // Extrair os PDAs da estrutura UplineEntry
        for (const entry of referrerInfo.upline.upline) {
          uplines.push(entry.pda);
        }

        if (uplines && uplines.length > 0) {
          // Processar uplines usando a função CORRIGIDA
          remainingAccounts = await prepareUplinesForRecursion(
            uplines,
            program,
            connection,
            wallet,
            anchorWallet
          );
        } else {
        }
      } catch (e) {
        return;
      }
    }

    const userWsolAccount = await anchor.utils.token.associatedAddress({
      mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
      owner: wallet.adapter.publicKey,
    });

    const userTokenAccount = await anchor.utils.token.associatedAddress({
      mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
      owner: wallet.adapter.publicKey,
    });

    await setupVaultTokenAccount(connection, wallet, anchorWallet);

    await setupReferrerTokenAccount(
      MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS,
      connection,
      wallet,
      anchorWallet
    );

    await setVersionedTransaction(
      wallet,
      program,
      depositAmount,
      remainingAccounts,
      connection,
      lookupTableAccount.value,
      anchorWallet
    );
  } catch (err) {
    ErrorService.onError(err);
    notificationService.error({
      title: "error_preparing_accounts_title",
      message: "error_preparing_accounts_description",
    });
    await closeWalletOnError(wallet, anchorWallet, connection);
    throw err;
  }
}
