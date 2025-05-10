import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { Decimal } from "@/lib/Decimal";
import { CacheService, DerivedPDAResponse } from "@/services/cache-service";
import { ErrorService } from "@/services/error-service";
import { NotificationsService } from "@/services/NotificationService";
import { store } from "@/store";
import * as anchor from "@project-serum/anchor";
import { Idl, Program, web3 } from "@project-serum/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { AnchorWallet, Wallet } from "@solana/wallet-adapter-react";
import {
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

/**
 * Prepares uplines for recursion by creating the correct account structure
 */
async function prepareUplinesForRecursion(
  uplinePDAs: PublicKey[],
  program: Program<Idl>,
  connection: Connection,
  wallet: Wallet
) {
  const remainingAccounts = [];
  const triosInfo = [];

  console.log(
    `\n🔄 PREPARING ${uplinePDAs.length} UPLINES (MAX 6) FOR RECURSION`
  );

  // Collect upline information
  for (let i = 0; i < Math.min(uplinePDAs.length, 6); i++) {
    const uplinePDA = uplinePDAs[i];
    console.log(`  Analyzing upline ${i + 1}: ${uplinePDA.toString()}`);

    try {
      // Get data directly from the account
      const uplineInfo = await program.account.userAccount.fetch(uplinePDA);
      if (!uplineInfo.isRegistered) {
        console.log(`  ❌ Upline não está registrado! Ignorando.`);
        continue;
      }

      let uplineWallet;

      if (uplineInfo.ownerWallet) {
        uplineWallet = uplineInfo.ownerWallet;
        console.log(
          `  ✅ Wallet get from owner_wallet: ${uplineWallet.toString()}`
        );
      } else if (
        uplineInfo.upline &&
        uplineInfo.upline.upline &&
        Array.isArray(uplineInfo.upline.upline) &&
        uplineInfo.upline.upline.length > 0
      ) {
        // Find the entry corresponding to this specific upline
        let foundEntry = null;
        for (const entry of uplineInfo.upline.upline) {
          if (entry.pda && entry.pda.equals(uplinePDA)) {
            foundEntry = entry;
            console.log(`  ✅ Entry found in UplineEntry structure`);
            break;
          }
        }

        if (foundEntry) {
          // Use data from the correct entry
          uplineWallet = foundEntry.wallet;
          console.log(
            `  ✅ Wallet get from correct entry: ${uplineWallet.toString()}`
          );
        } else {
          // If corresponding entry not found, use the first entry
          console.log(
            `  ⚠️ Specific entry not found, using first entry of structure`
          );
          uplineWallet = uplineInfo.upline.upline[0].wallet;
          console.log(`    Wallet: ${uplineWallet.toString()}`);
        }
      } else {
        // Fallback for other methods if previous options fail
        console.log(
          `  ⚠️ UplineEntry structure missing or incomplete (possible base user)`
        );
        continue;
      }

      const uplineTokenAccount = await anchor.utils.token.associatedAddress({
        mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
        owner: uplineWallet,
      });

      console.log(
        `  💰 ATA derived for wallet: ${uplineTokenAccount.toString()}`
      );

      const ataInfo = await connection.getAccountInfo(uplineTokenAccount);
      if (!ataInfo) {
        console.log(
          `  ⚠️ ATA doesn't exist, will be derived on-chain by the contract`
        );
      } else {
        console.log(`  ✅ ATA already exists`);
      }

      // Add to the trio info for sorting later
      triosInfo.push({
        pda: uplinePDA,
        wallet: uplineWallet,
        ata: uplineTokenAccount,
        depth: parseInt(uplineInfo.upline.depth.toString()),
      });
    } catch (e) {
      console.log(`  ❌ Error analyzing upline: ${e.message}`);
    }
  }

  // IMPORTANT: Sort trios by DESCENDING depth (higher to lower)
  triosInfo.sort((a, b) => b.depth - a.depth);

  console.log(`\n📊 UPLINE PROCESSING ORDER (Higher depth → Lower):`);
  for (let i = 0; i < triosInfo.length; i++) {
    console.log(
      `  ${i + 1}. PDA: ${triosInfo[i].pda.toString()} (Depth: ${
        triosInfo[i].depth
      })`
    );
    console.log(`    Wallet: ${triosInfo[i].wallet.toString()}`);
    console.log(`    ATA: ${triosInfo[i].ata.toString()}`);
  }

  // Build remainingAccounts array with TRIOS ONLY
  for (let i = 0; i < triosInfo.length; i++) {
    const trio = triosInfo[i];

    // 1. Add ONLY PDA account
    remainingAccounts.push({
      pubkey: trio.pda,
      isWritable: true,
      isSigner: false,
    });

    // 2. Add ONLY wallet
    remainingAccounts.push({
      pubkey: trio.wallet,
      isWritable: true,
      isSigner: false,
    });

    // 3. Add ONLY ATA
    remainingAccounts.push({
      pubkey: trio.ata,
      isWritable: true,
      isSigner: false,
    });
  }

  // Verification to ensure we only have trios
  if (remainingAccounts.length % 3 !== 0) {
    console.error(
      "⚠️ WARNING: Number of accounts is not a multiple of 3. This indicates a problem!"
    );
  } else {
    console.log(
      `  ✅ Total uplines processed: ${remainingAccounts.length / 3}`
    );
    console.log(`  ✅ Total accounts added: ${remainingAccounts.length}`);
    console.log(`  ✅ Confirmed: ONLY TRIOS (PDA, wallet, ATA) being passed!`);
  }

  return remainingAccounts;
}

/**
 * Gets all the needed derived PDAs for the registration process
 */
export async function getNeededDerivedPDA(
  wallet: Wallet
): Promise<DerivedPDAResponse> {
  const cacheService = CacheService.getInstance();
  const cacheKey = wallet.adapter.publicKey.toString();
  const referrerAddress = localStorage.getItem("sponsor")
    ? new PublicKey(localStorage.getItem("sponsor") as string)
    : MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS;

  // PDA for user
  const [userAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_account"), wallet.adapter.publicKey.toBuffer()],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  );
  const [referrerAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_account"), referrerAddress.toBuffer()],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  );

  // PDA for minting authority
  const [tokenMintAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_mint_authority")],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  );

  // PDA for vault authority
  const [vaultAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_vault_authority")],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  );

  // PDA for program_sol_vault
  const [programSolVault] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_sol_vault")],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  );

  // Calculate token vault address
  const programTokenVault = await anchor.utils.token.associatedAddress({
    mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
    owner: vaultAuthority,
  });

  // Create ATA for referrer
  const referrerTokenAccount = await anchor.utils.token.associatedAddress({
    mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
    owner: referrerAddress,
  });

  // Get user's WSOL ATA
  const userWsolAccount = await anchor.utils.token.associatedAddress({
    mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
    owner: wallet.adapter.publicKey,
  });

  const result = {
    tokenMintAuthority,
    vaultAuthority,
    programSolVault,
    programTokenVault,
    referrerTokenAccount,
    userWsolAccount,
    userAccount,
    referrerAccount,
  };

  // Cache the result for 60 seconds
  cacheService.set<DerivedPDAResponse>("derived_pda", cacheKey, result);

  return result;
}

/**
 * Main function to register a user with SOL deposit
 */
export async function registerWithSolDepositV3({
  amount,
  connection,
  program,
  wallet,
  anchorWallet,
  notificationService,
  lookupTableAccount,
}: {
  amount: string | number;
  connection: Connection;
  program: Program<Idl>;
  wallet: Wallet;
  anchorWallet: AnchorWallet;
  notificationService: NotificationsService<typeof store>;
  lookupTableAccount: AddressLookupTableAccount;
}) {
  try {
    console.log(
      "🚀 REGISTERING USER WITH REFERRER, CHAINLINK ORACLE AND ALT 🚀"
    );

    // Get referrer from localStorage or default
    const referrerAddress = localStorage.getItem("sponsor")
      ? new PublicKey(localStorage.getItem("sponsor") as string)
      : MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS;

    if (!referrerAddress) {
      console.error("❌ ERROR: Referrer address not provided!");
      console.error(
        "Please provide the referrer address as the third argument."
      );
      return;
    }

    console.log("📋 BASIC INFORMATION:");
    console.log("🧑‍💻 New user: " + wallet.adapter.publicKey.toString());
    console.log("🧑‍🤝‍🧑 Referrer: " + referrerAddress.toString());
    console.log("💰 Deposit amount: " + amount + " SOL");

    // Convert amount to lamports
    const FIXED_DEPOSIT_AMOUNT =
      typeof amount === "string"
        ? new anchor.BN(new Decimal(amount, { scale: 9 }).subunits)
        : new anchor.BN(amount);

    // Check balance
    const balance = await connection.getBalance(wallet.adapter.publicKey);
    if (balance < FIXED_DEPOSIT_AMOUNT.toNumber() + 30000000) {
      console.error("❌ ERROR: Insufficient balance!");
      notificationService.error({
        title: "error_insufficient_balance_title",
        message: "error_insufficient_balance_description",
      });
      return null;
    }

    // Get referrer account
    const [referrerAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_account"), referrerAddress.toBuffer()],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );
    console.log("📄 REFERRER PDA: " + referrerAccount.toString());

    // Check referrer
    let referrerInfo;
    try {
      referrerInfo = await program.account.userAccount.fetch(referrerAccount);
      if (!referrerInfo.isRegistered) {
        console.error("❌ ERROR: Referrer is not registered!");
        return null;
      }

      console.log("✅ Referrer verified");
      console.log("🔢 Depth: " + referrerInfo.upline.depth.toString());
      console.log("📊 Filled slots: " + referrerInfo.chain.filledSlots + "/3");

      if (referrerInfo.ownerWallet) {
        console.log(
          "✅ Referrer has owner_wallet field: " +
            referrerInfo.ownerWallet.toString()
        );
      }

      const nextSlotIndex = referrerInfo.chain.filledSlots;
      if (nextSlotIndex >= 3) {
        console.log("⚠️ WARNING: Referrer's matrix is already full!");
        return null;
      }
    } catch (e) {
      console.error("❌ Error checking referrer:", e);
      return null;
    }

    // Check user account
    const [userAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_account"), wallet.adapter.publicKey.toBuffer()],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    try {
      const userInfo = await program.account.userAccount.fetch(userAccount);
      if (userInfo.isRegistered) {
        console.log("⚠️ You are already registered in the system!");
        return null;
      }
    } catch (e) {
      console.log("✅ PROCEEDING WITH REGISTRATION...");
    }

    // Get needed PDAs
    const {
      tokenMintAuthority,
      vaultAuthority,
      programSolVault,
      programTokenVault,
      referrerTokenAccount,
      userWsolAccount,
    } = await getNeededDerivedPDA(wallet);

    // Log WSOL ATA info
    console.log("🔍 DEBUG: User WSOL account:", userWsolAccount.toString());
    console.log(
      "⚠ Se a ATA do WSOL não existir, será criada on-chain pelo programa"
    );

    // Prepare uplines for recursion if needed
    let remainingAccounts = [];
    const isSlot3 = referrerInfo.chain.filledSlots === 2;

    if (isSlot3 && referrerInfo.upline && referrerInfo.upline.upline) {
      console.log("\n🔄 Preparing uplines for recursion (slot 3)");
      try {
        const uplines = referrerInfo.upline.upline.map((entry) => entry.pda);
        if (uplines.length > 0) {
          remainingAccounts = await prepareUplinesForRecursion(
            uplines,
            program,
            connection,
            wallet
          );
        }
      } catch (e) {
        console.log(`❌ Error preparing recursion: ${e.message}`);
        return null;
      }
    }

    // Prepare versioned transaction
    console.log("\n📤 PREPARING VERSIONED TRANSACTION WITH ALT...");

    // Set compute unit limit and priority
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 1_400_000,
    });

    const setPriority = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 5000,
    });

    // Setup vault A and Chainlink accounts
    const vaultAAccounts = [
      {
        pubkey: MAIN_ADDRESSESS_CONFIG.A_VAULT_LP,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: MAIN_ADDRESSESS_CONFIG.A_VAULT_LP_MINT,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: MAIN_ADDRESSESS_CONFIG.A_TOKEN_VAULT,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: MAIN_ADDRESSESS_CONFIG.A_VAULT,
        isWritable: true,
        isSigner: false,
      },
    ];

    const chainlinkAccounts = [
      {
        pubkey: MAIN_ADDRESSESS_CONFIG.SOL_USD_FEED,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: MAIN_ADDRESSESS_CONFIG.CHAINLINK_PROGRAM,
        isWritable: false,
        isSigner: false,
      },
    ];

    const allRemainingAccounts = [
      ...vaultAAccounts,
      ...chainlinkAccounts,
      ...remainingAccounts,
    ];

    // Create register instruction
    const registerIx = await program.methods
      .registerWithSolDeposit(FIXED_DEPOSIT_AMOUNT)
      .accounts({
        state: MAIN_ADDRESSESS_CONFIG.STATE_ADDRESS,
        userWallet: wallet.adapter.publicKey,
        referrer: referrerAccount,
        referrerWallet: referrerAddress,
        user: userAccount,
        userWsolAccount: userWsolAccount,
        wsolMint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
        pool: MAIN_ADDRESSESS_CONFIG.POOL_ADDRESS,
        bVault: MAIN_ADDRESSESS_CONFIG.B_VAULT,
        bTokenVault: MAIN_ADDRESSESS_CONFIG.B_TOKEN_VAULT,
        bVaultLpMint: MAIN_ADDRESSESS_CONFIG.B_VAULT_LP_MINT,
        bVaultLp: MAIN_ADDRESSESS_CONFIG.B_VAULT_LP,
        vaultProgram: MAIN_ADDRESSESS_CONFIG.VAULT_PROGRAM,
        programSolVault: programSolVault,
        tokenMint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
        programTokenVault: programTokenVault,
        referrerTokenAccount: referrerTokenAccount,
        tokenMintAuthority: tokenMintAuthority,
        vaultAuthority: vaultAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .remainingAccounts(allRemainingAccounts)
      .instruction();

    // Create versioned transaction
    const { blockhash } = await connection.getLatestBlockhash();

    const messageV0 = new TransactionMessage({
      payerKey: wallet.adapter.publicKey,
      recentBlockhash: blockhash,
      instructions: [modifyComputeUnits, setPriority, registerIx],
    }).compileToV0Message([lookupTableAccount]);

    const transaction = new VersionedTransaction(messageV0);

    // Sign transaction
    const signedTx = await anchorWallet.signTransaction(transaction);

    // Send transaction
    console.log("\n📤 SENDING VERSIONED TRANSACTION...");
    const txid = await connection.sendRawTransaction(signedTx.serialize(), {
      skipPreflight: true,
      maxRetries: 5,
    });

    console.log("✅ Transaction sent: " + txid);
    console.log(
      `🔍 Explorer link: https://solscan.io/tx/${txid}?cluster=devnet`
    );

    // Wait for confirmation
    await connection.confirmTransaction(txid, "confirmed");
    console.log("✅ Transaction confirmed!");

    // Verify results
    const userInfo = await program.account.userAccount.fetch(userAccount);
    console.log("\n📋 REGISTRATION CONFIRMATION:");
    console.log("✅ User registered: " + userInfo.isRegistered);
    console.log("🧑‍🤝‍🧑 Referrer: " + userInfo.referrer.toString());
    console.log("🔢 Depth: " + userInfo.upline.depth.toString());
    console.log("📊 Filled slots: " + userInfo.chain.filledSlots + "/3");

    return txid;
  } catch (error) {
    console.error("❌ ERROR DURING REGISTRATION:", error);

    if (error.logs) {
      console.log("\n📋 DETAILED ERROR LOGS:");
      error.logs.forEach((log: string, i: number) =>
        console.log(`${i}: ${log}`)
      );
    }

    // Just log the error instead of calling handleTransactionError
    ErrorService.onError(error);
    throw error;
  }
}
