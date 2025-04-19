import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
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
  Transaction,
  TransactionInstruction,
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
  } catch (e) {}
}

async function findWalletForPDA(
  pdaAccount: any,
  connection: Connection,
  program: Program<Idl>,
  wallet: Wallet
) {
  // Fixed mapping of known PDAs to wallets
  const knownPDAMappings = {
    // Add your known keys here
  };

  const pdaString = pdaAccount.toString();
  if (knownPDAMappings[pdaString]) {
    return new PublicKey(knownPDAMappings[pdaString]);
  }

  // Try to derive from oldest transaction
  try {
    const signatures = await connection.getSignaturesForAddress(pdaAccount, {
      limit: 5,
    });

    if (signatures && signatures.length > 0) {
      // Sort by oldest first (likely creation transaction)
      signatures.sort((a, b) => a.blockTime - b.blockTime);

      for (const sig of signatures) {
        try {
          const tx = await connection.getTransaction(sig.signature);

          // Look for account creator (signer)
          if (tx && tx.transaction && tx.transaction.message) {
            const signers = tx.transaction.message.accountKeys.filter(
              (k, idx) =>
                tx.transaction.message.isAccountSigner(idx) &&
                !k.equals(MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID) &&
                !k.equals(SystemProgram.programId)
            );

            if (signers.length > 0) {
              // Verify if this wallet actually derives to this PDA
              const [derivedPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("user_account"), signers[0].toBuffer()],
                MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
              );

              if (derivedPDA.equals(pdaAccount)) {
                return signers[0];
              }
            }
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  // Try to extract from referrer in account
  try {
    const accountInfo = await program.account.userAccount.fetch(pdaAccount);

    if (accountInfo.referrer) {
      const [derivedPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_account"), accountInfo.referrer.toBuffer()],
        MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
      );

      if (derivedPDA.equals(pdaAccount)) {
        return accountInfo.referrer;
      }
    }
  } catch (e) {}

  // Fallback
  return wallet.adapter.publicKey;
}

export async function prepareUplinesForRecursion(
  uplinePDAs: any,
  program: Program<Idl>,
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet
) {
  const remainingAccounts = [];
  const triosInfo = [];

  // First, collect upline information
  for (let i = 0; i < Math.min(uplinePDAs.length, 10); i++) {
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

      // Determine ATA for tokens
      const uplineTokenAccount = await anchor.utils.token.associatedAddress({
        mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
        owner: uplineWallet,
      });

      // Check if ATA exists and create if needed
      try {
        const tokenAccountInfo = await connection.getAccountInfo(
          uplineTokenAccount
        );
        if (!tokenAccountInfo) {
          const instructions = [];

          // Create instruction for ATA
          instructions.push(
            Token.createAssociatedTokenAccountInstruction(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
              uplineTokenAccount,
              uplineWallet,
              wallet.adapter.publicKey
            )
          );

          const transaction = new web3.Transaction().add(...instructions);
          transaction.feePayer = wallet.adapter.publicKey;
          const { blockhash } = await connection.getLatestBlockhash();
          transaction.recentBlockhash = blockhash;

          // Sign and send transaction
          const signedTx = await anchorWallet.signTransaction(transaction);
          const txid = await connection.sendRawTransaction(
            signedTx.serialize()
          );
          await connection.confirmTransaction(txid, "confirmed");
        }
      } catch (e) {}

      // Store information for sorting - TRIO ONLY!
      triosInfo.push({
        pda: uplinePDA,
        wallet: uplineWallet,
        ata: uplineTokenAccount,
        depth: parseInt(uplineInfo.upline.depth.toString()),
      });
    } catch (e) {}
  }

  // IMPORTANT: Sort trios by DESCENDING depth (higher to lower)
  triosInfo.sort((a, b) => b.depth - a.depth);

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
      "⚠️ WARNING: Number of accounts is not multiple of 3. This indicates an issue!"
    );
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
        data: Buffer.from([9]), // CloseAccount command
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
    }
  } catch (e) {
    // Ignore errors here
  }
}

export async function getNeededDerivedPDA(wallet: Wallet) {
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
    owner: MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS,
  });

  // Get user's WSOL ATA
  const userWsolAccount = await anchor.utils.token.associatedAddress({
    mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
    owner: wallet.adapter.publicKey,
  });

  return {
    tokenMintAuthority,
    vaultAuthority,
    programSolVault,
    programTokenVault,
    referrerTokenAccount,
    userWsolAccount,
    userAccount,
    referrerAccount,
  };
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
  const registerInstructions = [];

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000, // Increase limit for complex transactions
  });

  registerInstructions.push(modifyComputeUnits);

  // Create main program instruction (don't execute yet)
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
  const { blockhash } = await connection.getLatestBlockhash();

  // Create versioned transaction message
  const messageV0 = new TransactionMessage({
    payerKey: wallet.adapter.publicKey,
    recentBlockhash: blockhash,
    instructions: registerInstructions,
  }).compileToV0Message([lookupTableAccount]);

  const transactionV0 = new VersionedTransaction(messageV0);

  const signedTx = await anchorWallet.signTransaction(transactionV0);

  const txid = await connection.sendRawTransaction(signedTx.serialize(), {
    skipPreflight: true,
  });

  await connection.confirmTransaction(txid, "confirmed");

  try {
    // Check user account state
    const userInfo = await program.account.userAccount.fetch(userAccount);

    if (userInfo.ownerWallet) {
      // Verificar se a owner_wallet corresponde à carteira do usuário
      if (userInfo.ownerWallet.equals(wallet.adapter.publicKey)) {
      } else {
      }
    } else {
    }

    // Check referrer state after registration
    const newReferrerInfo = await program.account.userAccount.fetch(
      referrerAccount
    );

    // If was in slot 3, check recursion processing
    if (
      newReferrerInfo.chain.filledSlots === 2 &&
      remainingAccounts.length > 0
    ) {
      let uplineReverseCount = 0;
      for (let i = 0; i < remainingAccounts.length; i += 3) {
        if (i >= remainingAccounts.length) break;

        try {
          const uplineAccount = remainingAccounts[i].pubkey;
          const uplineWallet = remainingAccounts[i + 1].pubkey;
          const uplineATA = remainingAccounts[i + 2].pubkey;

          const uplineInfo = await program.account.userAccount.fetch(
            uplineAccount
          );

          // Verificar se os novos campos estão presentes e se correspondem
          if (uplineInfo.ownerWallet) {
            if (!uplineInfo.ownerWallet.equals(uplineWallet)) {
            }
          }

          // Verificar se o referenciador foi adicionado à matriz do upline
          for (let j = 0; j < uplineInfo.chain.filledSlots; j++) {
            if (
              uplineInfo.chain.slots[j] &&
              uplineInfo.chain.slots[j].equals(referrerAccount)
            ) {
              uplineReverseCount++;
              break;
            }
          }

          // Verificar valores reservados
          if (uplineInfo.reservedSol > 0) {
          }

          if (uplineInfo.reservedTokens > 0) {
          }

          // Verificar saldo SOL da wallet armazenada na conta
          const walletToCheck = uplineInfo.ownerWallet || uplineWallet;
          const walletBalance = await connection.getBalance(walletToCheck);

          // Verificar saldo tokens da ATA armazenada na conta
          try {
            const ataToCheck = uplineInfo.ownerTokenAta || uplineATA;
            const tokenBalance = await connection.getTokenAccountBalance(
              ataToCheck
            );
          } catch (e) {}
        } catch (e) {}
      }
    }

    // Obter e mostrar o novo saldo
    await connection.getBalance(wallet.adapter.publicKey);
  } catch (e) {
    console.log("❌ ERROR CHECKING RESULTS:", e);
    ErrorService.onError(e);
  }
}
