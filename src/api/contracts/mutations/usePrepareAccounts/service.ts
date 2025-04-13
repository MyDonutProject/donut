import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { Decimal } from "@/lib/Decimal";
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
}: {
  amount: string;
  connection: Connection;
  program: Program<Idl>;
  wallet: Wallet;
  anchorWallet: AnchorWallet;
}) {
  try {
    const toDecimalAmount = new Decimal(amount, { scale: 10 });
    const depositAmount = new anchor.BN(toDecimalAmount.subunits);
    const balance = await connection.getBalance(wallet.adapter.publicKey);

    console.log(balance, "balance");
    console.log(depositAmount.toNumber(), "depositAmount");
    console.log(
      balance < depositAmount.toNumber() + 10000000,
      "balance < depositAmount.toNumber() + 10000000"
    );

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

    console.log(referrerInfo, "referrerInfo");

    console.log("✅ Referenciador verificado");
    console.log("🔢 Profundidade: " + referrerInfo.upline.depth.toString());

    const nextSlotIndex = referrerInfo.chain.filledSlots;
    if (nextSlotIndex >= 3) {
      console.log("⚠️ ATENÇÃO: A matriz do referenciador já está cheia!");
      return null;
    }

    console.log(
      "🎯 VOCÊ PREENCHERÁ O SLOT " + (nextSlotIndex + 1) + " DA MATRIZ"
    );

    console.log("\n🔍 VERIFICANDO SUA CONTA...");

    const [userAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_account"), wallet.adapter.publicKey.toBuffer()],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    try {
      const userInfo = await program.account.userAccount.fetch(userAccount);
      if (userInfo.isRegistered) {
        console.log("⚠️ Você já está registrado no sistema!");
        return null;
      }
    } catch (e) {
      console.log("✅ Prosseguindo com o registro...");
    }

    // 4. Obter ATA do usuário para WSOL
    const userWsolAccount = await anchor.utils.token.associatedAddress({
      mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
      owner: wallet.adapter.publicKey,
    });
    console.log("🔑 WSOL ATA que será usada: " + userWsolAccount.toString());

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
        console.log(
          "\n🔄 Preparando uplines para recursividade otimizada (slot 3)"
        );

        try {
          const uplines = referrerInfo.upline.upline;

          if (uplines && uplines.length > 0) {
            console.log(`  Encontradas ${uplines.length} uplines disponíveis`);
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
          } else {
            console.log("  Referenciador não tem uplines anteriores");
          }
        } catch (e) {
          console.log(`❌ Erro ao preparar recursividade: ${e.message}`);
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
      console.log("\n💱 PREPARANDO CONTA WSOL PARA DEPÓSITO...");

      // Fechar a conta WSOL existente se necessário
      if (wsolAccountStatus.exists) {
        try {
          console.log("  Fechando conta WSOL existente para recriá-la...");
          const closeIx = new TransactionInstruction({
            keys: [
              { pubkey: userWsolAccount, isSigner: false, isWritable: true },
              {
                pubkey: wallet.adapter.publicKey,
                isSigner: false,
                isWritable: true,
              },
              {
                pubkey: wallet.adapter.publicKey,
                isSigner: true,
                isWritable: false,
              },
            ],
            programId: MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID,
            data: Buffer.from([9]), // Comando CloseAccount
          });

          const closeTx = new Transaction().add(closeIx);
          closeTx.feePayer = wallet.adapter.publicKey;
          const { blockhash } = await connection.getLatestBlockhash();
          closeTx.recentBlockhash = blockhash;

          const signedCloseTx = await anchorWallet.signTransaction(closeTx);
          const closeTxid = await connection.sendRawTransaction(
            signedCloseTx.serialize()
          );
          await connection.confirmTransaction(closeTxid, "confirmed");
          console.log("  ✅ Conta WSOL fechada com sucesso");
        } catch (closeErr) {
          console.log(
            "  ⚠️ Erro ao fechar conta WSOL existente: " + closeErr.message
          );
        }
      }

      // Criar nova conta WSOL
      console.log(
        `\n💱 CRIANDO CONTA WSOL COM DEPÓSITO DE: ${
          depositAmount.toNumber() / 1e9
        } SOL...`
      );

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
      console.log(`✅ Conta WSOL criada e financiada com sucesso!`);

      // Verificar o saldo final da conta WSOL
      try {
        const finalTokenInfo = await connection.getTokenAccountBalance(
          userWsolAccount
        );
        console.log(
          `  Saldo final da conta WSOL: ${finalTokenInfo.value.amount} lamports`
        );
      } catch (e) {
        console.log("  ⚠️ Erro ao verificar saldo final WSOL: " + e.message);
      }
    } else {
      console.log(
        `\n✅ Conta WSOL já existe com saldo suficiente: ${wsolAccountStatus.balance} lamports`
      );
      console.log(
        `  Saldo necessário para depósito: ${depositAmount.toNumber()} lamports`
      );
    }

    // Retornar os dados necessários para a fase 2
    const phase2Data = {
      depositAmount,
      userAccount,
      userWsolAccount,
      referrerAccount,
      referrerTokenAccount,
      programTokenVault,
      uplinesData,
    };
    // console.log("Phase 2 data:", phase2Data);
    await phase2_registerUser(
      phase2Data,
      connection,
      wallet,
      anchorWallet,
      program
    );
    // console.log("Phase 2 registration complete");
  } catch (err) {
    console.log("Error while preparing accounts:" + err);
    // Se houver erro, verificar a conta WSOL e tentar fechá-la para recuperar fundos
    try {
      const userWsolAccount = await anchor.utils.token.associatedAddress({
        mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
        owner: wallet.adapter.publicKey,
      });

      const wsolInfo = await connection.getAccountInfo(userWsolAccount);
      if (wsolInfo && wsolInfo.data.length > 0) {
        console.log("\n🧹 Tentando fechar conta WSOL para recuperar fundos...");
        const closeIx = new TransactionInstruction({
          keys: [
            { pubkey: userWsolAccount, isSigner: false, isWritable: true },
            {
              pubkey: wallet.adapter.publicKey,
              isSigner: false,
              isWritable: true,
            },
            {
              pubkey: wallet.adapter.publicKey,
              isSigner: true,
              isWritable: false,
            },
          ],
          programId: MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID,
          data: Buffer.from([9]), // Comando CloseAccount
        });

        const closeTx = new Transaction().add(closeIx);
        closeTx.feePayer = wallet.adapter.publicKey;
        const { blockhash } = await connection.getLatestBlockhash();
        closeTx.recentBlockhash = blockhash;

        const signedCloseTx = await anchorWallet.signTransaction(closeTx);
        const closeTxid = await connection.sendRawTransaction(
          signedCloseTx.serialize()
        );
        await connection.confirmTransaction(closeTxid, "confirmed");
        console.log("✅ Conta WSOL fechada e fundos recuperados");
      }
    } catch (e) {
      // Ignorar erros aqui
    }
    throw err;
  }
}
