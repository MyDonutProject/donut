import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { ErrorService } from "@/services/error-service";
import * as anchor from "@project-serum/anchor";
import { Idl, Program, web3 } from "@project-serum/anchor";
import { Connection } from "@reown/appkit-adapter-solana/react";
import { AnchorWallet, Wallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
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
        console.log(`  Current WSOL account balance: ${balance} lamports`);
        return { exists: true, balance };
      } catch (e) {
        console.log(`  Error checking WSOL account balance: ${e.message}`);
        return { exists: true, balance: 0 };
      }
    }

    return { exists: false, balance: 0 };
  } catch (e) {
    console.log(`  Error checking WSOL account: ${e.message}`);
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
  const referrerTokenAccount = await anchor.utils.token.associatedAddress({
    mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
    owner: referrerAddress,
  });

  // Check if ATA already exists
  try {
    const tokenAccountInfo = await connection.getAccountInfo(
      referrerTokenAccount
    );

    if (!tokenAccountInfo) {
      const createATAIx = new web3.TransactionInstruction({
        keys: [
          {
            pubkey: wallet.adapter.publicKey,
            isSigner: true,
            isWritable: true,
          },
          { pubkey: referrerTokenAccount, isSigner: false, isWritable: true },
          { pubkey: referrerAddress, isSigner: false, isWritable: false },
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
            pubkey: web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: MAIN_ADDRESSESS_CONFIG.ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
      });

      const tx = new web3.Transaction().add(createATAIx);
      tx.feePayer = wallet.adapter.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      try {
        const signedTx = await anchorWallet.signTransaction(tx);
        const txid = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(txid, "confirmed");
        console.log();
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

export async function findWalletForPDA(
  pdaAccount: any,
  connection: Connection,
  program: Program<Idl>,
  wallet: Wallet
) {
  // METHOD 1: Try to derive from oldest transaction with more history
  try {
    const signatures = await connection.getSignaturesForAddress(pdaAccount, {
      limit: 20,
    }); // Increase limit

    if (signatures && signatures.length > 0) {
      // Sort by oldest first (likely creation transaction)
      signatures.sort((a, b) => a.blockTime - b.blockTime);

      for (const sig of signatures) {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            commitment: "confirmed",
          });

          if (tx && tx.transaction && tx.transaction.message) {
            // Examine all signers
            const signers = tx.transaction.message.accountKeys.filter(
              (k, idx) =>
                tx.transaction.message.isAccountSigner(idx) &&
                !k.equals(MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID) &&
                !k.equals(SystemProgram.programId)
            );

            for (const signer of signers) {
              try {
                const [derivedPDA] = PublicKey.findProgramAddressSync(
                  [Buffer.from("user_account"), signer.toBuffer()],
                  MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
                );

                if (derivedPDA.equals(pdaAccount)) {
                  return signer;
                }
              } catch (e) {}
            }
          }
        } catch (e) {
          // Silently fail and try next
        }
      }
    }
  } catch (e) {}

  // METHOD 2: Try to extract from referrer in account
  try {
    const accountInfo = await program.account.userAccount.fetch(pdaAccount);

    if (accountInfo.referrer) {
      // Check if referrer is the derivation
      try {
        const [derivedPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("user_account"), accountInfo.referrer.toBuffer()],
          MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
        );

        if (derivedPDA.equals(pdaAccount)) {
          return accountInfo.referrer;
        }
      } catch (e) {}
    }

    // Check if any matrix slots derive to this PDA
    if (accountInfo.chain && accountInfo.chain.slots) {
      for (const slot of accountInfo.chain.slots) {
        if (slot) {
          try {
            const [derivedPDA] = PublicKey.findProgramAddressSync(
              [Buffer.from("user_account"), slot.toBuffer()],
              MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
            );

            if (derivedPDA.equals(pdaAccount)) {
              return slot;
            }
          } catch (e) {}
        }
      }
    }
  } catch (e) {}

  // METHOD 3: Try to derive PDA from all wallets in transactions
  try {
    const signatures = await connection.getSignaturesForAddress(pdaAccount, {
      limit: 30,
    });

    if (signatures && signatures.length > 0) {
      const allAccounts = new Set();

      for (const sig of signatures) {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            commitment: "confirmed",
          });

          if (tx && tx.transaction && tx.transaction.message) {
            // Collect all accounts from transaction
            const accounts = tx.transaction.message.accountKeys;
            accounts.forEach((account) => allAccounts.add(account.toString()));
          }
        } catch (e) {
          // Silently fail and try next
        }
      }

      // Try to derive PDA from each account
      for (const accountStr of allAccounts) {
        try {
          const account = new PublicKey(accountStr);

          // Skip system accounts
          if (
            account.equals(SystemProgram.programId) ||
            account.equals(MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID) ||
            account.equals(MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID) ||
            account.equals(MAIN_ADDRESSESS_CONFIG.ASSOCIATED_TOKEN_PROGRAM_ID)
          ) {
            continue;
          }

          const [derivedPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_account"), account.toBuffer()],
            MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
          );

          if (derivedPDA.equals(pdaAccount)) {
            return account;
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  // Fallback
  // console.log(`  ⚠️ Could not determine wallet for this PDA`);
  return wallet.adapter.publicKey;
}

export async function prepareUplinesForRecursion(
  uplinePDAs: any,
  referrerFilledSlots: any,
  program: Program<Idl>,
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet
) {
  const remainingAccounts = [];
  const uplinesInfo = [];

  // Initialize flags
  let needsPool = false;
  let needsReserve = false;
  let needsPayment = false;

  // CORRECTION: Set flags based on direct referrer slot first
  // This ensures payment is processed correctly when slot 2 is filled
  if (referrerFilledSlots === 2) {
    needsPayment = true;
  }

  // First, collect information about uplines
  for (let i = 0; i < uplinePDAs.length; i++) {
    const uplinePDA = uplinePDAs[i];

    try {
      // Check upline account
      const uplineInfo = await program.account.userAccount.fetch(uplinePDA);

      if (!uplineInfo.isRegistered) {
        continue;
      }

      // Determine original wallet for this PDA
      const uplineWallet = await findWalletForPDA(
        uplinePDA,
        connection,
        program,
        wallet
      );

      console.log("uplineWallet", uplineWallet);

      // Determine ATA for tokens (always needed for future payments)
      const uplineTokenAccount = await anchor.utils.token.associatedAddress({
        mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
        owner: uplineWallet,
      });

      console.log("uplineTokenAccount", uplineTokenAccount);

      // Create ATA to avoid future issues
      try {
        const tokenAccountInfo = await connection.getAccountInfo(
          uplineTokenAccount
        );
        if (!tokenAccountInfo) {
          // console.log(`  Creating ATA for upline...`);

          const createATAIx = new TransactionInstruction({
            keys: [
              {
                pubkey: wallet.adapter.publicKey,
                isSigner: true,
                isWritable: true,
              },
              { pubkey: uplineTokenAccount, isSigner: false, isWritable: true },
              { pubkey: uplineWallet, isSigner: false, isWritable: false },
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
                pubkey: web3.SYSVAR_RENT_PUBKEY,
                isSigner: false,
                isWritable: false,
              },
            ],
            programId: MAIN_ADDRESSESS_CONFIG.ASSOCIATED_TOKEN_PROGRAM_ID,
            data: Buffer.from([]),
          });

          const tx = new web3.Transaction().add(createATAIx);
          tx.feePayer = wallet.adapter.publicKey;
          const { blockhash } = await connection.getLatestBlockhash();
          tx.recentBlockhash = blockhash;

          try {
            const signedTx = await anchorWallet.signTransaction(tx);
            const txid = await connection.sendRawTransaction(
              signedTx.serialize()
            );
            await connection.confirmTransaction(txid, "confirmed");
          } catch (e) {
            ErrorService.onError(e);
            // Continue trying to ensure robustness
          }

          // Verify if ATA was actually created
          try {
            const verifyAccountInfo = await connection.getAccountInfo(
              uplineTokenAccount
            );
            if (!verifyAccountInfo) {
              console.log(
                `  ⚠️ Failed to create ATA, but continuing processing`
              );
            } else {
              console.log(
                `  ✅ ATA verified after creation: ${uplineTokenAccount.toString()}`
              );
            }
          } catch (e) {
            ErrorService.onError(e);
          }
        } else {
          console.log(
            `  ✅ ATA already exists for upline: ${uplineTokenAccount.toString()}`
          );
        }
      } catch (e) {
        ErrorService.onError(e);
      }

      // Store information for sorting
      uplinesInfo.push({
        pda: uplinePDA,
        wallet: uplineWallet,
        ata: uplineTokenAccount,
        depth: parseInt(uplineInfo.upline.depth.toString()),
        filledSlots: parseInt(uplineInfo.chain.filledSlots.toString()),
      });
    } catch (e) {
      ErrorService.onError(e);
    }
  }

  // IMPORTANT: Sort by DECREASING depth (higher to lower)
  uplinesInfo.sort((a, b) => b.depth - a.depth);

  for (let i = 0; i < uplinesInfo.length; i++) {
    console.log(
      `  ${i + 1}. PDA: ${uplinesInfo[i].pda.toString()} (Depth: ${
        uplinesInfo[i].depth
      }, Slots: ${uplinesInfo[i].filledSlots}/3)`
    );
  }

  // NEW LOGIC: Find recursion stop point
  let relevantUplines = [];

  // Check how many uplines actually need processing
  for (let i = 0; i < uplinesInfo.length; i++) {
    const upline = uplinesInfo[i];

    // Add this upline to relevant ones
    relevantUplines.push(upline);

    // Determine needs based on current slot for recursion
    if (upline.filledSlots === 0) {
      // Found empty slot (0) - deposit will go to pool
      // We activate needsPool regardless of what was set before
      needsPool = true;

      break;
    } else if (upline.filledSlots === 1) {
      // Found slot 1 (second slot) - deposit will be reserved
      // We activate needsReserve regardless of what was set before
      needsReserve = true;

      break;
    } else if (upline.filledSlots === 2) {
      // Found slot 2 (third slot) - need to continue recursion
      // Don't overwrite needsPayment, which may already be activated by direct referrer
      // Continue loop to find next upline
    }
  }

  // Now add only relevant uplines and their specific accounts
  for (let i = 0; i < relevantUplines.length; i++) {
    const upline = relevantUplines[i];

    // 1. Add PDA account (always needed)
    remainingAccounts.push({
      pubkey: upline.pda,
      isWritable: true,
      isSigner: false,
    });

    // 2. Add wallet (always needed)
    remainingAccounts.push({
      pubkey: upline.wallet,
      isWritable: true,
      isSigner: false,
    });

    // 3. Add ATA only if slot 2 (token payment)
    // or if last relevant upline (may receive tokens later)
    remainingAccounts.push({
      pubkey: upline.ata,
      isWritable: true,
      isSigner: false,
    });
  }

  return {
    remainingAccounts,
    needsPool,
    needsReserve,
    needsPayment,
  };
}

export async function setupVaultTokenAccount(
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet
) {
  // Derive vault authority PDA
  const [vaultAuthority] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("token_vault_authority")],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  );

  // Calculate token vault address
  const programTokenVault = await anchor.utils.token.associatedAddress({
    mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
    owner: vaultAuthority,
  });

  // Check if ATA already exists
  try {
    const vaultAccountInfo = await connection.getAccountInfo(programTokenVault);

    if (!vaultAccountInfo) {
      const createVaultATAIx = new web3.TransactionInstruction({
        keys: [
          {
            pubkey: wallet.adapter.publicKey,
            isSigner: true,
            isWritable: true,
          },
          { pubkey: programTokenVault, isSigner: false, isWritable: true },
          { pubkey: vaultAuthority, isSigner: false, isWritable: false },
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
            pubkey: web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: MAIN_ADDRESSESS_CONFIG.ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
      });

      const tx = new web3.Transaction().add(createVaultATAIx);
      tx.feePayer = wallet.adapter.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      try {
        const signedTx = await anchorWallet.signTransaction(tx);
        const txid = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(txid, "confirmed");
      } catch (e) {
        ErrorService.onError(e);

        // Check again if ATA was created despite error
        const verifyAccountInfo = await connection.getAccountInfo(
          programTokenVault
        );
        if (verifyAccountInfo) {
          console.log(
            `  ✅ Vault ATA exists despite error: ${programTokenVault.toString()}`
          );
        }
      }
    }

    return programTokenVault;
  } catch (e) {
    ErrorService.onError(e);
    return programTokenVault;
  }
}

export async function phase2_registerUser(
  phase1Data: any,
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet,
  program: Program<Idl>
) {
  if (!phase1Data) {
    console.error("❌ Phase 1 data not available. Execute Phase 1 first.");
    return;
  }

  try {
    const {
      depositAmount,
      userAccount,
      userWsolAccount,
      referrerAccount,
      referrerTokenAccount,
      programTokenVault,
      uplinesData,
    } = phase1Data;

    // Derive required PDAs
    const [tokenMintAuthority] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("token_mint_authority")],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    const [vaultAuthority] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("token_vault_authority")],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    const [programSolVault] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("program_sol_vault")],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    // CORRECTION: Ensure pool accounts are included when needsPool is true
    // This is important for recursion
    const accounts = {
      // Basic accounts (always needed)
      state: MAIN_ADDRESSESS_CONFIG.STATE_ADDRESS,
      userWallet: wallet.adapter.publicKey,
      referrer: referrerAccount,
      referrerWallet: MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS,
      user: userAccount,
      userWsolAccount: userWsolAccount,
      wsolMint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
      pythSolUsdPrice: MAIN_ADDRESSESS_CONFIG.PYTH_SOL_USD,

      // Optional Pool-specific accounts (Slot 1)
      pool: uplinesData.needsPool ? MAIN_ADDRESSESS_CONFIG.POOL_ADDRESS : null,
      bVault: uplinesData.needsPool ? MAIN_ADDRESSESS_CONFIG.B_VAULT : null,
      bTokenVault: uplinesData.needsPool
        ? MAIN_ADDRESSESS_CONFIG.B_TOKEN_VAULT
        : null,
      bVaultLpMint: uplinesData.needsPool
        ? MAIN_ADDRESSESS_CONFIG.B_VAULT_LP_MINT
        : null,
      bVaultLp: uplinesData.needsPool
        ? MAIN_ADDRESSESS_CONFIG.B_VAULT_LP
        : null,
      vaultProgram: uplinesData.needsPool
        ? MAIN_ADDRESSESS_CONFIG.VAULT_PROGRAM
        : null,

      // Always needed accounts
      programSolVault: programSolVault,
      tokenMint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
      programTokenVault: programTokenVault,

      // Optional payment account (Slot 3)
      referrerTokenAccount: uplinesData.needsPayment
        ? referrerTokenAccount
        : null,

      // Other required accounts
      tokenMintAuthority: tokenMintAuthority,
      vaultAuthority: vaultAuthority,
      tokenProgram: MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      associatedTokenProgram:
        MAIN_ADDRESSESS_CONFIG.ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
    };

    // CORRECTION: Check and print detailed info for debugging
    if (uplinesData.needsPayment) {
      try {
        const referrerTokenInfo = await connection.getAccountInfo(
          referrerTokenAccount
        );
        if (!referrerTokenInfo) {
          console.log(
            "⚠️ WARNING: Referrer ATA doesn't exist! Trying to create..."
          );
          await setupReferrerTokenAccount(
            MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS,
            connection,
            wallet,
            anchorWallet
          );
        } else {
          console.log(
            " ✅ Confirmed: Referrer Associated Token Account exists!"
          );
        }
      } catch (e) {
        console.log(`⚠️ Error checking referrer ATA: ${e.message}`);
      }
    }

    try {
      // Use optimized method correctly
      const tx = await program.methods
        .registerWithSolDepositOptimized(
          depositAmount,
          uplinesData.needsPool,
          uplinesData.needsReserve,
          uplinesData.needsPayment
        )
        .accounts(accounts)
        .remainingAccounts(uplinesData.remainingAccounts)
        .rpc({
          commitment: "confirmed",
          skipPreflight: true,
        });

      await connection.confirmTransaction(tx, "confirmed");
    } catch (e) {
      ErrorService.onError(e);
      throw e;
    }

    // Verify results

    try {
      // Check user account state
      const userInfo = await program.account.userAccount.fetch(userAccount);

      // Check referrer account state after registration
      const newReferrerInfo = await program.account.userAccount.fetch(
        referrerAccount
      );

      // Check WSOL account - should be closed after transaction
      const wsolInfo = await connection.getAccountInfo(userWsolAccount);
      if (!wsolInfo || wsolInfo.data.length === 0) {
        console.log("\n✅ Wsol account was closed correctly after processing");
      } else {
        console.log("\n⚠️ Wsol account is still open after processing");

        // Close WSOL account manually if still open
        console.log("🧹 Trying to close WSOL account...");
        try {
          const closeIx = new web3.TransactionInstruction({
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
            data: Buffer.from([9]), // CloseAccount command
          });

          const closeTx = new web3.Transaction().add(closeIx);
          closeTx.feePayer = wallet.adapter.publicKey;
          const { blockhash } = await connection.getLatestBlockhash();
          closeTx.recentBlockhash = blockhash;

          const signedCloseTx = await anchorWallet.signTransaction(closeTx);
          const closeTxid = await connection.sendRawTransaction(
            signedCloseTx.serialize()
          );
          await connection.confirmTransaction(closeTxid, "confirmed");
        } catch (e) {
          ErrorService.onError(e);
        }
      }

      // Obter e mostrar o novo saldo

      if (uplinesData.remainingAccounts.length > 0) {
        // Verificar apenas as PDAs (a cada 3 contas)
        for (let i = 0; i < uplinesData.remainingAccounts.length; i += 3) {
          if (i < uplinesData.remainingAccounts.length) {
            const uplinePDA = uplinesData.remainingAccounts[i].pubkey;

            try {
              await program.account.userAccount.fetch(uplinePDA);
            } catch (e) {
              ErrorService.onError(e);
            }
          }
        }
      }
    } catch (e) {
      ErrorService.onError(e);
    }
  } catch (error) {
    ErrorService.onError(error);

    // If there's an error, check the WSOL account and try to close it to recover funds
    try {
      await closeWalletOnError(wallet, anchorWallet, connection);
    } catch (e) {
      // Ignorar erros aqui
    }
  }
}

export async function closeWalletOnError(
  wallet: Wallet,
  anchorWallet: AnchorWallet,
  connection: Connection
) {
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
      console.log("✅ WSOL account closed and funds recovered");
    }
  } catch (e) {
    // Ignore errors here
  }
}
