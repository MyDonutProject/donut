import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { CacheService, DerivedPDAResponse } from "@/services/cache-service";
import { ErrorService } from "@/services/error-service";
import * as anchor from "@project-serum/anchor";
import { Idl, Program, web3 } from "@project-serum/anchor";
import { Connection } from "@reown/appkit-adapter-solana/react";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { AnchorWallet, Wallet } from "@solana/wallet-adapter-react";
import {
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

export async function checkWsolAccount(
  userWsolAccount: PublicKey,
  connection: Connection
) {
  try {
    const wsolAccountInfo = await connection.getAccountInfo(userWsolAccount);

    if (wsolAccountInfo) {
      try {
        const tokenInfo = await connection.getTokenAccountBalance(
          userWsolAccount
        );
        const balance = Number(tokenInfo.value.amount);
        return { exists: true, balance };
      } catch (e) {
        return { exists: true, balance: 0 };
      }
    }

    return { exists: false, balance: 0 };
  } catch (e) {
    return { exists: false, balance: 0 };
  }
}

export async function setupReferrerTokenAccount(
  referrerAddress: PublicKey,
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet
) {
  // Calculate ATA address for referrer
  const { referrerTokenAccount } = await getNeededDerivedPDA(wallet);

  // Check if ATA already exists
  try {
    const tokenAccountInfo = await connection.getAccountInfo(
      referrerTokenAccount
    );

    if (!tokenAccountInfo) {
      const createATAIx = Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
        referrerTokenAccount,
        referrerAddress,
        wallet.adapter.publicKey
      );

      const tx = new web3.Transaction().add(createATAIx);
      tx.feePayer = wallet.adapter.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      try {
        const signedTx = await anchorWallet.signTransaction(tx);
        const txid = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(txid, "confirmed");
        console.log(`  ✅ Referrer ATA created: ${txid}`);
      } catch (e) {
        ErrorService.onError(e);
        // Check again if ATA was created despite error
        await connection.getAccountInfo(referrerTokenAccount);
      }
    }

    return referrerTokenAccount;
  } catch (e) {
    ErrorService.onError(e);
    return referrerTokenAccount;
  }
}

export async function setupUserWsolAccount(
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet
) {
  const { userWsolAccount } = await getNeededDerivedPDA(wallet);

  const userWsolInfo = await connection.getAccountInfo(userWsolAccount);
  if (userWsolInfo) {
    return;
  }

  try {
    // Create instruction for ATA creation
    const createATAIx = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
      userWsolAccount,
      wallet.adapter.publicKey,
      wallet.adapter.publicKey
    );

    const transaction = new web3.Transaction().add(createATAIx);
    transaction.feePayer = wallet.adapter.publicKey;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // Sign and send transaction
    const signedTx = await anchorWallet.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(txid, "confirmed");
    console.log(`  ✅ WSOL ATA created: ${txid}`);
  } catch (e) {
    console.log(`  Error creating WSOL ATA: ${e.message}`);
  }
}

// New function that gets upline account data directly
async function getUplineAccountData(
  pdaAccount: PublicKey,
  program: Program<Idl>
) {
  try {
    // Fetch account data
    const accountInfo = await program.account.userAccount.fetch(pdaAccount);

    if (!accountInfo.isRegistered) {
      throw new Error(`PDA ${pdaAccount.toString()} is not registered`);
    }

    if (!accountInfo.ownerWallet) {
      throw new Error(
        `PDA ${pdaAccount.toString()} does not have owner_wallet field`
      );
    }

    console.log(
      `  ✅ Wallet found in account: ${accountInfo.ownerWallet.toString()}`
    );
    console.log(
      `  ✅ Token ATA found in account: ${accountInfo.ownerTokenAta.toString()}`
    );

    return {
      wallet: accountInfo.ownerWallet,
      tokenAta: accountInfo.ownerTokenAta,
      depth: accountInfo.upline.depth,
    };
  } catch (e) {
    console.log(`  ❌ Error fetching account: ${e.message}`);
    throw e;
  }
}

export async function prepareUplinesForRecursion(
  uplinePDAs: PublicKey[],
  program: Program<Idl>,
  connection: Connection,
  wallet: Wallet
) {
  const remainingAccounts = [];
  const triosInfo = [];

  console.log(
    `\n🔄 PREPARING ${uplinePDAs.length} UPLINES (MAX 10) FOR RECURSION`
  );

  // Collect upline information
  for (let i = 0; i < Math.min(uplinePDAs.length, 10); i++) {
    const uplinePDA = uplinePDAs[i];
    console.log(`  Analyzing upline ${i + 1}: ${uplinePDA.toString()}`);

    try {
      // Get data directly from the account
      const uplineData = await getUplineAccountData(uplinePDA, program);

      // Store information for sorting - TRIO ONLY!
      triosInfo.push({
        pda: uplinePDA,
        wallet: uplineData.wallet,
        ata: uplineData.tokenAta,
        depth: parseInt(uplineData.depth.toString()),
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
  // ENSURING no redundant data!
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

  // Extra verification to ensure we only have trios
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

export async function setupVaultTokenAccount(
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet
) {
  const { programTokenVault, vaultAuthority } = await getNeededDerivedPDA(
    wallet
  );

  // Check if ATA already exists
  try {
    const vaultAccountInfo = await connection.getAccountInfo(programTokenVault);

    if (!vaultAccountInfo) {
      const createATAIx = Token.createAssociatedTokenAccountInstruction(
        MAIN_ADDRESSESS_CONFIG.ASSOCIATED_TOKEN_PROGRAM_ID,
        MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID,
        MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
        programTokenVault,
        vaultAuthority,
        wallet.adapter.publicKey
      );

      const tx = new web3.Transaction().add(createATAIx);

      tx.feePayer = wallet.adapter.publicKey;

      const { blockhash } = await connection.getLatestBlockhash();

      tx.recentBlockhash = blockhash;

      try {
        const signedTx = await anchorWallet.signTransaction(tx);
        const txid = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(txid, "confirmed");
        console.log(`  ✅ Program token vault ATA created: ${txid}`);
      } catch (e) {
        ErrorService.onError(e);

        // Check again if ATA was created despite error
        await connection.getAccountInfo(programTokenVault);
      }
    }

    return programTokenVault;
  } catch (e) {
    ErrorService.onError(e);
    return programTokenVault;
  }
}

// Modified function to handle errors without closing WSOL account
export async function handleTransactionError(
  error: any,
  wallet: Wallet,
  connection: Connection
) {
  try {
    console.log(`  ⚠️ Transaction error occurred: ${error.message}`);

    // Log any transaction logs if available
    if (error.logs && Array.isArray(error.logs)) {
      console.log("  Transaction logs:");
      error.logs.forEach((log: string, index: number) => {
        console.log(`    ${index}: ${log}`);
      });
    }

    // Check if user's WSOL account exists but don't close it
    const { userWsolAccount } = await getNeededDerivedPDA(wallet);
    const wsolInfo = await connection.getAccountInfo(userWsolAccount);

    if (wsolInfo && wsolInfo.data.length > 0) {
      console.log(
        `  ℹ️ WSOL account exists with ${wsolInfo.lamports / 1e9} SOL`
      );
      // The WSOL account will be kept open as per the contract philosophy
    }

    ErrorService.onError(error);
  } catch (e) {
    // Ignore errors in error handling
    console.log(`  ⚠️ Error during error handling: ${e}`);
  }
}

export async function getNeededDerivedPDA(
  wallet: Wallet
): Promise<DerivedPDAResponse> {
  const cacheService = CacheService.getInstance();
  const cacheKey = wallet.adapter.publicKey.toString();
  const cachedResult = cacheService.get<DerivedPDAResponse>(
    "derived_pda",
    cacheKey
  );

  if (cachedResult) {
    console.log("🔍 DEBUG: Using cached PDA values for wallet:", cacheKey);
    return cachedResult;
  }

  // PDA for user
  const [userAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_account"), wallet.adapter.publicKey.toBuffer()],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  );
  const [referrerAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("user_account"),
      MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS.toBuffer(),
    ],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  );

  console.log("🔍 DEBUG: User account:", userAccount.toString());
  // PDA for minting authority
  const [tokenMintAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_mint_authority")],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  );
  console.log("🔍 DEBUG: Token mint authority:", tokenMintAuthority.toString());

  // PDA for vault authority
  const [vaultAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_vault_authority")],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  );
  console.log("🔍 DEBUG: Vault authority:", vaultAuthority.toString());
  // PDA for program_sol_vault
  const [programSolVault] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_sol_vault")],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  );
  console.log("🔍 DEBUG: Program sol vault:", programSolVault.toString());
  // Calculate token vault address
  const programTokenVault = await anchor.utils.token.associatedAddress({
    mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
    owner: vaultAuthority,
  });
  console.log("🔍 DEBUG: Program token vault:", programTokenVault.toString());
  // Create ATA for referrer
  const referrerTokenAccount = await anchor.utils.token.associatedAddress({
    mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
    owner: MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS,
  });

  console.log(
    "🔍 DEBUG: Referrer token account:",
    referrerTokenAccount.toString()
  );
  // Get user's WSOL ATA
  const userWsolAccount = await anchor.utils.token.associatedAddress({
    mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
    owner: wallet.adapter.publicKey,
  });
  console.log("🔍 DEBUG: User wsol account:", userWsolAccount.toString());

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

export async function setVersionedTransaction(
  wallet: Wallet,
  program: Program<Idl>,
  depositAmount: number,
  remainingAccounts: any[],
  connection: Connection,
  lookupTableAccount: AddressLookupTableAccount,
  anchorWallet: AnchorWallet
) {
  //get needed derived PDAs
  const {
    tokenMintAuthority,
    vaultAuthority,
    programSolVault,
    referrerTokenAccount,
    programTokenVault,
    referrerAccount,
    userWsolAccount,
    userAccount,
  } = await getNeededDerivedPDA(wallet);
  console.log("\n📤 PREPARING VERSIONED TRANSACTION WITH ALT...");
  const registerInstructions = [];

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000, // Increase limit for complex transactions
  });

  // Also add a priority instruction
  const setPriority = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 5000, // Increase transaction priority
  });

  registerInstructions.push(modifyComputeUnits);
  registerInstructions.push(setPriority);

  // Create main program instruction
  console.log("  🔍 Creating register_with_sol_deposit instruction...");
  const accounts = {
    state: MAIN_ADDRESSESS_CONFIG.STATE_ADDRESS,
    userWallet: wallet.adapter.publicKey,
    referrer: referrerAccount,
    referrerWallet: MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS,
    user: userAccount,
    userWsolAccount: userWsolAccount,
    wsolMint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
    pythSolUsdPrice: MAIN_ADDRESSESS_CONFIG.PYTH_SOL_USD,
    pool: MAIN_ADDRESSESS_CONFIG.POOL_ADDRESS,
    bVault: MAIN_ADDRESSESS_CONFIG.B_VAULT,
    bTokenVault: MAIN_ADDRESSESS_CONFIG.B_TOKEN_VAULT,
    bVaultLpMint: MAIN_ADDRESSESS_CONFIG.B_VAULT_LP_MINT,
    bVaultLp: MAIN_ADDRESSESS_CONFIG.B_VAULT_LP,
    programSolVault: programSolVault,
    tokenMint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
    programTokenVault: programTokenVault,
    referrerTokenAccount: referrerTokenAccount,
    tokenMintAuthority: tokenMintAuthority,
    vaultAuthority: vaultAuthority,
    vaultProgram: MAIN_ADDRESSESS_CONFIG.VAULT_PROGRAM,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  const registerIx = await program.methods
    .registerWithSolDeposit(depositAmount)
    .accounts(accounts)
    .remainingAccounts(remainingAccounts)
    .instruction();

  // Add program instruction to array
  registerInstructions.push(registerIx);

  // Create versioned transaction with ALT
  console.log("  🔍 Building versioned transaction...");
  const { blockhash } = await connection.getLatestBlockhash();

  // Create versioned transaction message
  const messageV0 = new TransactionMessage({
    payerKey: wallet.adapter.publicKey,
    recentBlockhash: blockhash,
    instructions: registerInstructions,
  }).compileToV0Message([lookupTableAccount]);

  const transactionV0 = new VersionedTransaction(messageV0);

  console.log("  ✍️ Signing transaction...");

  const signedTx = await anchorWallet.signTransaction(transactionV0);

  // Send transaction
  console.log("  📡 Sending transaction...");

  try {
    const txid = await connection.sendRawTransaction(signedTx.serialize(), {
      skipPreflight: true,
    });

    console.log("✅ TRANSACTION SENT: " + txid);
    console.log(
      `🔍 Explorer link: https://solscan.io/tx/${txid}?cluster=devnet`
    );
    console.log("\n⏳ WAITING FOR CONFIRMATION...");

    await connection.confirmTransaction(txid, "confirmed");
    console.log("✅ TRANSACTION CONFIRMED!");

    // Check user account state
    const userInfo = await program.account.userAccount.fetch(userAccount);

    console.log("\n📋 REGISTRATION CONFIRMATION:");
    console.log("✅ User registered: " + userInfo.isRegistered);
    console.log("🧑‍🤝‍🧑 Referrer: " + userInfo.referrer.toString());
    console.log("🔢 Depth: " + userInfo.upline.depth.toString());
    console.log("📊 Filled slots: " + userInfo.chain.filledSlots + "/3");

    // Check if the new fields owner_wallet and owner_token_ata were added
    if (userInfo.ownerWallet) {
      console.log("\n📋 NEW FIELDS:");
      console.log("👤 Owner Wallet: " + userInfo.ownerWallet.toString());
      console.log("💰 Owner Token ATA: " + userInfo.ownerTokenAta.toString());

      // Check if owner_wallet matches user's wallet
      if (userInfo.ownerWallet.equals(wallet.adapter.publicKey)) {
        console.log("✅ New fields were correctly filled");
      } else {
        console.log("❌ ALERT: Owner Wallet does not match user's wallet!");
      }
    } else {
      console.log(
        "\n⚠️ New fields owner_wallet and owner_token_ata were not found!"
      );
      console.log(
        "   This may indicate that the new contract version is not active."
      );
    }

    // Check referrer state after registration
    const newReferrerInfo = await program.account.userAccount.fetch(
      referrerAccount
    );
    console.log("\n📋 REFERRER STATE AFTER REGISTRATION:");
    console.log("📊 Filled slots: " + newReferrerInfo.chain.filledSlots + "/3");

    // If slot 3 was filled and matrix completed, check recursion processing
    if (
      newReferrerInfo.chain.filledSlots === 0 &&
      remainingAccounts.length > 0
    ) {
      console.log("\n🔄 CHECKING RECURSION RESULTS:");

      let uplineReverseCount = 0;
      for (let i = 0; i < remainingAccounts.length; i += 3) {
        if (i >= remainingAccounts.length) break;

        try {
          const uplineAccount = remainingAccounts[i].pubkey;
          const uplineWallet = remainingAccounts[i + 1].pubkey;
          const uplineATA = remainingAccounts[i + 2].pubkey;

          console.log(`\n  Checking upline: ${uplineAccount.toString()}`);
          console.log(`  Passed wallet: ${uplineWallet.toString()}`);
          console.log(`  Passed ATA: ${uplineATA.toString()}`);

          const uplineInfo = await program.account.userAccount.fetch(
            uplineAccount
          );
          console.log(`  Filled slots: ${uplineInfo.chain.filledSlots}/3`);

          // Check if new fields are present and match
          if (uplineInfo.ownerWallet) {
            console.log(
              `  👤 Owner Wallet in account: ${uplineInfo.ownerWallet.toString()}`
            );
            console.log(
              `  💰 Owner Token ATA in account: ${uplineInfo.ownerTokenAta.toString()}`
            );

            if (!uplineInfo.ownerWallet.equals(uplineWallet)) {
              console.log(
                `  ⚠️ WARNING: Wallet in account does not match wallet passed in trio!`
              );
              console.log(
                `  Contract should now use wallet stored in account.`
              );
            }
          }

          // Check if referrer was added to upline's matrix
          for (let j = 0; j < uplineInfo.chain.filledSlots; j++) {
            if (
              uplineInfo.chain.slots[j] &&
              uplineInfo.chain.slots[j].equals(referrerAccount)
            ) {
              console.log(`  ✅ REFERRER ADDED IN SLOT ${j + 1}!`);
              uplineReverseCount++;
              break;
            }
          }

          // Check reserved values
          if (uplineInfo.reservedSol > 0) {
            console.log(
              `  💰 Reserved SOL: ${uplineInfo.reservedSol / 1e9} SOL`
            );
          }

          if (uplineInfo.reservedTokens > 0) {
            console.log(
              `  🪙 Reserved Tokens: ${uplineInfo.reservedTokens / 1e9} tokens`
            );
          }

          // Check SOL balance of wallet stored in account
          const walletToCheck = uplineInfo.ownerWallet || uplineWallet;
          const walletBalance = await connection.getBalance(walletToCheck);
          console.log(
            `  💰 SOL balance of wallet ${walletToCheck.toString()}: ${
              walletBalance / 1e9
            } SOL`
          );

          // Check token balance of ATA stored in account
          try {
            const ataToCheck = uplineInfo.ownerTokenAta || uplineATA;
            const tokenBalance = await connection.getTokenAccountBalance(
              ataToCheck
            );
            console.log(
              `  🪙 Token balance in ATA ${ataToCheck.toString()}: ${
                tokenBalance.value.uiAmount
              }`
            );
          } catch (e) {
            console.log(`  ⚠️ Could not check token balance: ${e.message}`);
          }
        } catch (e) {
          console.log(`  Error checking upline: ${e.message}`);
        }
      }

      console.log(
        `\n  ✅ Recursion processed ${uplineReverseCount}/${
          remainingAccounts.length / 3
        } uplines`
      );
    }

    // Get and show new balance
    const newBalance = await connection.getBalance(wallet.adapter.publicKey);
    console.log("\n💼 Your new balance: " + newBalance / 1e9 + " SOL");

    console.log("\n🎉 REGISTRATION WITH REFERRER COMPLETED SUCCESSFULLY! 🎉");
    console.log("=========================================================");
    console.log("\n⚠️ IMPORTANT: SAVE THESE ADDRESSES FOR FUTURE USE:");
    console.log("🔑 YOUR ADDRESS: " + wallet.adapter.publicKey.toString());
    console.log("🔑 YOUR PDA ACCOUNT: " + userAccount.toString());
    console.log(
      "🔑 ADDRESS LOOKUP TABLE: " +
        MAIN_ADDRESSESS_CONFIG.LOOKUP_TABLE_ADDRESS.toString()
    );
  } catch (e) {
    console.log("❌ ERROR PROCESSING TRANSACTION:");
    // Use the new error handler instead of trying to close WSOL
    await handleTransactionError(e, wallet, connection);
  }
}
