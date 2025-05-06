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

    console.log("📋 BASIC INFORMATION:");
    console.log("🧑‍💻 New user: " + wallet.adapter.publicKey.toString());
    console.log(
      "🧑‍🤝‍🧑 Referrer: " + MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS.toString()
    );
    console.log("💰 Deposit amount: " + amount + " SOL");

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

    console.log(`✅ ALT loaded: ${lookupTableAccount.value.key.toString()}`);
    console.log(
      `📊 Total addresses: ${lookupTableAccount.value.state.addresses.length}`
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
      console.log("🔍 DEBUG: Fetching referrer info");

      // Validate program state
      if (!program?.account?.userAccount) {
        console.error("❌ ERROR: Invalid program state:", {
          programExists: !!program,
          accountExists: !!program?.account,
          userAccountExists: !!program?.account?.userAccount,
        });
        throw new Error("Invalid program state");
      }

      // Validate connection
      try {
        const accountInfo = await connection.getAccountInfo(referrerAccount);
        console.log("🔍 DEBUG: Account info from connection:", {
          exists: !!accountInfo,
          size: accountInfo?.data?.length,
          executable: accountInfo?.executable,
        });
      } catch (e) {
        console.error("❌ ERROR: Failed to get account info:", e);
      }

      // Helper function to fetch minimal referrer data
      const fetchMinimalReferrerInfo = async () => {
        let account = null;
        try {
          console.log(
            "🔍 DEBUG: About to fetch account from address:",
            referrerAccount.toString()
          );
          try {
            account = await Promise.race([
              program.account.userAccount.fetch(referrerAccount),
              new Promise((_, reject) =>
                setTimeout(
                  () => reject(new Error("Fetch timeout after 30s")),
                  1000
                )
              ),
            ]);
          } catch (fetchError) {
            console.error("❌ ERROR: Failed to fetch account:", {
              error: fetchError.message,
              stack: fetchError.stack,
              name: fetchError.name,
            });

            // Try fallback method
            console.log("🔍 DEBUG: Attempting fallback fetch method...");
            try {
              const rawAccount = await connection.getAccountInfo(
                referrerAccount
              );
              if (rawAccount) {
                console.log(
                  "�� DEBUG: Raw account data fetched, attempting to decode..."
                );
                try {
                  account = program.coder.accounts.decode(
                    "userAccount",
                    rawAccount.data
                  );
                  console.log("✅ DEBUG: Successfully decoded account data");
                } catch (decodeError) {
                  console.error(
                    "❌ ERROR: Failed to decode account:",
                    decodeError
                  );
                  throw decodeError;
                }
              } else {
                console.error("❌ ERROR: No account data found in fallback");
                throw new Error("Account not found");
              }
            } catch (fallbackError) {
              console.error("❌ ERROR: Fallback method failed:", fallbackError);
              throw fallbackError;
            }
          }

          console.log("🔍 DEBUG: Account fetch completed", account);

          const minimalInfo = account;

          return minimalInfo;
        } catch (error) {
          // Clean up on error
          if (account) {
            account.chain = null;
            account.upline = null;
            account = null;
          }
          throw error;
        }
      };

      referrerInfo = await fetchMinimalReferrerInfo();

      console.log("🔍 DEBUG: Referrer info:", referrerInfo);

      if (!referrerInfo.isRegistered) {
        console.error("❌ ERROR: Referrer is not registered!");
        return;
      }

      console.log("✅ Referrer verified");
      console.log("🔢 Depth: " + referrerInfo.upline.depth.toString());
      console.log("📊 Filled slots: " + referrerInfo.chain.filledSlots + "/3");

      // Check if referrer has new fields
      if (referrerInfo.ownerWallet) {
        console.log(
          "✅ Referrer uses new fields owner_wallet and owner_token_ata"
        );
        console.log("💼 Owner Wallet: " + referrerInfo.ownerWallet.toString());
        const referrerATA = await anchor.utils.token.associatedAddress({
          mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
          owner: referrerInfo.ownerWallet,
        });
        console.log("💰 Owner Token ATA: " + referrerATA.toString());
      } else {
        console.log(
          "ℹ️ Referrer uses old structure (without owner_wallet and owner_token_ata fields)"
        );
      }

      // Notify which slot will be filled
      const nextSlotIndex = referrerInfo.chain.filledSlots;
      if (nextSlotIndex >= 3) {
        console.log("⚠️ WARNING: Referrer's matrix is already full!");
        return;
      }

      console.log(
        "🎯 YOU WILL FILL SLOT " + (nextSlotIndex + 1) + " OF THE MATRIX"
      );
    } catch (e) {
      console.error("❌ Error checking referrer:", e);
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
    console.log("\n🔍 CHECKING YOUR ACCOUNT...");
    const [userAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_account"), wallet.adapter.publicKey.toBuffer()],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    try {
      const userInfo = await program.account.userAccount.fetch(userAccount);
      if (userInfo.isRegistered) {
        console.log("⚠️ You are already registered in the system!");
        return;
      }
    } catch (e) {
      console.log("✅ Proceeding with registration...");
    }

    let remainingAccounts = [];

    const isSlot3 = referrerInfo.chain.filledSlots === 2;
    console.log("🔍 DEBUG: Is slot 3:", isSlot3);

    if (isSlot3 && referrerInfo.upline && referrerInfo.upline.upline) {
      console.log("\n🔄 Preparing uplines for recursion (slot 3)");

      try {
        const uplines = [];
        // Extract PDAs from UplineEntry structure
        for (const entry of referrerInfo.upline.upline) {
          uplines.push(entry.pda);
        }

        if (uplines && uplines.length > 0) {
          console.log(`  Found ${uplines.length} available uplines`);
          // Process uplines using CORRECTED function
          remainingAccounts = await prepareUplinesForRecursion(
            uplines,
            program,
            connection,
            wallet,
            anchorWallet
          );
        } else {
          console.log("  Referrer has no previous uplines");
        }
      } catch (e) {
        console.log(`❌ Error preparing recursion: ${e.message}`);
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

    throw err;
  }
}
