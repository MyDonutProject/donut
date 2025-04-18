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
    console.log("🔍 DEBUG: Starting fetchPrepareAccounts");
    console.log("🔍 DEBUG: Input amount:", amount);
    console.log(
      "🔍 DEBUG: Wallet public key:",
      wallet.adapter.publicKey.toString()
    );

    console.log("📋 INFORMAÇÕES BÁSICAS:");
    console.log("🧑‍💻 Novo usuário: " + wallet.adapter.publicKey.toString());
    console.log(
      "🧑‍🤝‍🧑 Referenciador: " + MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS.toString()
    );
    console.log("💰 Valor do depósito: " + amount + " SOL");

    const lookupTableAccount = await getLookupTableAccount();
    console.log("🔍 DEBUG: Lookup table account:", lookupTableAccount);

    if (!lookupTableAccount) {
      console.log("❌ DEBUG: Lookup table account not found");
      notificationService.error({
        title: "error_preparing_accounts_title",
        message: "error_preparing_accounts_description",
      });
      return null;
    }

    console.log(`✅ ALT carregada: ${lookupTableAccount.value.key.toString()}`);
    console.log(
      `📊 Total de endereços: ${lookupTableAccount.value.state.addresses.length}`
    );

    const toDecimalAmount = new Decimal(amount, { scale: 9 });
    console.log("🔍 DEBUG: Decimal amount:", toDecimalAmount);
    const depositAmount = new anchor.BN(toDecimalAmount.subunits);
    console.log("🔍 DEBUG: Deposit amount (BN):", depositAmount.toString());
    const balance = await connection.getBalance(wallet.adapter.publicKey);
    console.log("🔍 DEBUG: Wallet balance:", balance);

    if (balance < depositAmount.toNumber() + 10000000) {
      console.log("❌ DEBUG: Insufficient balance");
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
    console.log("🔍 DEBUG: Referrer account:", referrerAccount.toString());
    let referrerInfo;
    try {
      referrerInfo = await program.account.userAccount.fetch(referrerAccount);

      if (!referrerInfo.isRegistered) {
        console.error("❌ ERRO: O referenciador não está registrado!");
        return;
      }

      console.log("✅ Referenciador verificado");
      console.log("🔢 Profundidade: " + referrerInfo.upline.depth.toString());
      console.log(
        "📊 Slots preenchidos: " + referrerInfo.chain.filledSlots + "/3"
      );

      // Verificar se o referenciador tem os novos campos
      if (referrerInfo.ownerWallet) {
        console.log(
          "✅ Referenciador usa os novos campos owner_wallet e owner_token_ata"
        );
        console.log("💼 Owner Wallet: " + referrerInfo.ownerWallet.toString());
        console.log(
          "💰 Owner Token ATA: " + referrerInfo.ownerTokenAta.toString()
        );
      } else {
        console.log(
          "ℹ️ Referenciador usa estrutura antiga (sem campos owner_wallet e owner_token_ata)"
        );
      }

      // Avisar o slot que será preenchido
      const nextSlotIndex = referrerInfo.chain.filledSlots;
      if (nextSlotIndex >= 3) {
        console.log("⚠️ ATENÇÃO: A matriz do referenciador já está cheia!");
        return;
      }

      console.log(
        "🎯 VOCÊ PREENCHERÁ O SLOT " + (nextSlotIndex + 1) + " DA MATRIZ"
      );
    } catch (e) {
      console.error("❌ Erro ao verificar referenciador:", e);
      return;
    }
    const nextSlotIndex = referrerInfo.chain.filledSlots;
    console.log("🔍 DEBUG: Next slot index:", nextSlotIndex);

    if (nextSlotIndex >= 3) {
      console.log("❌ DEBUG: All slots filled");
      notificationService.error({
        title: "error_preparing_accounts_title",
        message: "error_preparing_accounts_description",
      });
      return null;
    }
    console.log("\n🔍 VERIFICANDO SUA CONTA...");
    const [userAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_account"), wallet.adapter.publicKey.toBuffer()],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    try {
      const userInfo = await program.account.userAccount.fetch(userAccount);
      if (userInfo.isRegistered) {
        console.log("⚠️ Você já está registrado no sistema!");
        return;
      }
    } catch (e) {
      console.log("✅ Prosseguindo com o registro...");
    }

    let remainingAccounts = [];

    const isSlot3 = referrerInfo.chain.filledSlots === 2;
    console.log("🔍 DEBUG: Is slot 3:", isSlot3);

    if (isSlot3 && referrerInfo.upline && referrerInfo.upline.upline) {
      console.log("\n🔄 Preparando uplines para recursividade (slot 3)");

      try {
        const uplines = [];
        // Extrair os PDAs da estrutura UplineEntry
        for (const entry of referrerInfo.upline.upline) {
          uplines.push(entry.pda);
        }

        if (uplines && uplines.length > 0) {
          console.log(`  Encontradas ${uplines.length} uplines disponíveis`);
          // Processar uplines usando a função CORRIGIDA
          remainingAccounts = await prepareUplinesForRecursion(
            uplines,
            program,
            connection,
            wallet,
            anchorWallet
          );
        } else {
          console.log("  Referenciador não tem uplines anteriores");
        }
      } catch (e) {
        console.log(`❌ Erro ao preparar recursividade: ${e.message}`);
        return;
      }
    }

    console.log("🔍 DEBUG: Setting up user WSOL account");
    const userWsolAccount = await anchor.utils.token.associatedAddress({
      mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
      owner: wallet.adapter.publicKey,
    });
    console.log("🔍 DEBUG: User WSOL account:", userWsolAccount.toString());
    const userTokenAccount = await anchor.utils.token.associatedAddress({
      mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
      owner: wallet.adapter.publicKey,
    });
    console.log("🔍 DEBUG: User token account:", userTokenAccount.toString());

    console.log("🔍 DEBUG: Setting up vault token account");
    await setupVaultTokenAccount(connection, wallet, anchorWallet);

    console.log("🔍 DEBUG: Setting up referrer token account");
    await setupReferrerTokenAccount(
      MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS,
      connection,
      wallet,
      anchorWallet
    );

    console.log("✅ DEBUG: Successfully completed fetchPrepareAccounts");

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
    console.log("❌ DEBUG: Error in fetchPrepareAccounts:", err);
    notificationService.error({
      title: "error_preparing_accounts_title",
      message: "error_preparing_accounts_description",
    });
    await closeWalletOnError(wallet, anchorWallet, connection);
    throw err;
  }
}
