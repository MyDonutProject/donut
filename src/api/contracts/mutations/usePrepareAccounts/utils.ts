import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract"
import { Decimal } from "@/lib/Decimal"
import { DerivedPDAResponse } from "@/services/cache-service"
import { ErrorService } from "@/services/error-service"
import { NotificationsService } from "@/services/NotificationService"
import { store } from "@/store"
import * as anchor from "@project-serum/anchor"
import { Idl, Program, utils, web3 } from "@project-serum/anchor"
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token"
import { AnchorWallet, Wallet } from "@solana/wallet-adapter-react"
import {
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js"

// Minimum deposit amount in USD (10 dollars in base units - 8 decimals)
const MINIMUM_USD_DEPOSIT = 10_00000000 // 10 USD with 8 decimals (Chainlink format)

// Maximum price feed staleness (24 hours in seconds)
const MAX_PRICE_FEED_AGE = 86400

// Default SOL price in case of stale feed ($100 USD per SOL)
const DEFAULT_SOL_PRICE = 100_00000000 // $100 with 8 decimals

/**
 * Formats a SOL amount for display while ensuring it matches the transaction value
 * @param amount The amount in SOL to format
 * @returns The formatted amount as a string with 9 decimals precision
 */
export function formatSolAmount(amount: string | number): string {
  const bnAmount =
    typeof amount === "string"
      ? new anchor.BN(
          amount.toString().replace(".", "").replace(",", "")
        ).mul(new anchor.BN(LAMPORTS_PER_SOL))
      : new anchor.BN(
          amount.toString().replace(".", "").replace(",", "")
        ).mul(new anchor.BN(LAMPORTS_PER_SOL))

  // Convert back to SOL with proper decimal places
  const decimalAmount = new Decimal(bnAmount.toString(), { scale: 9 })
  return decimalAmount.toNumberString()
}

/**
 * Prepares uplines for recursion by creating the correct account structure
 */
async function prepareUplinesForRecursion(
  uplinePDAs: PublicKey[],
  program: Program<Idl>,
  connection: Connection,
  wallet: Wallet
) {
  const remainingAccounts = []
  const triosInfo = []

  // Collect upline information
  for (let i = 0; i < Math.min(uplinePDAs.length, 6); i++) {
    const uplinePDA = uplinePDAs[i]

    try {
      // Get data directly from the account
      const uplineInfo = await program.account.userAccount.fetch(
        uplinePDA
      )

      let uplineWallet

      if (uplineInfo.ownerWallet) {
        uplineWallet = uplineInfo.ownerWallet
      } else if (
        uplineInfo.upline &&
        (uplineInfo.upline as any).upline &&
        Array.isArray((uplineInfo.upline as any).upline) &&
        (uplineInfo.upline as any).upline.length > 0
      ) {
        // Find the entry corresponding to this specific upline
        let foundEntry = null
        for (const entry of (uplineInfo.upline as any).upline) {
          if (entry.pda && entry.pda.equals(uplinePDA)) {
            foundEntry = entry
            break
          }
        }

        if (foundEntry) {
          // Use data from the correct entry
          uplineWallet = foundEntry.wallet
        } else {
          // If corresponding entry not found, use the first entry
          uplineWallet = (uplineInfo.upline as any).upline[0].wallet
        }
      } else {
        // Fallback for other methods if previous options fail
        continue
      }

      const uplineTokenAccount =
        await anchor.utils.token.associatedAddress({
          mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
          owner: uplineWallet,
        })

      // Add to the trio info for sorting later
      triosInfo.push({
        pda: uplinePDA,
        wallet: uplineWallet,
        ata: uplineTokenAccount,
        depth: parseInt((uplineInfo.upline as any).depth.toString()),
      })
    } catch (e) {}
  }

  // IMPORTANT: Sort trios by DESCENDING depth (higher to lower)
  triosInfo.sort((a, b) => b.depth - a.depth)

  // Build remainingAccounts array with TRIOS ONLY
  for (let i = 0; i < triosInfo.length; i++) {
    const trio = triosInfo[i]

    // 1. Add ONLY PDA account
    remainingAccounts.push({
      pubkey: trio.pda,
      isWritable: true,
      isSigner: false,
    })

    // 2. Add ONLY wallet
    remainingAccounts.push({
      pubkey: trio.wallet,
      isWritable: true,
      isSigner: false,
    })

    // 3. Add ONLY ATA
    remainingAccounts.push({
      pubkey: trio.ata,
      isWritable: true,
      isSigner: false,
    })
  }

  return remainingAccounts
}

/**
 * Gets all the needed derived PDAs for the registration process
 */
export async function getNeededDerivedPDA(
  wallet: Wallet
): Promise<DerivedPDAResponse> {
  const referrerAddress = localStorage.getItem("sponsor")
    ? new PublicKey(localStorage.getItem("sponsor") as string)
    : MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS

  const [tokenMintAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_mint_authority")],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  )

  const [vaultAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_vault_authority")],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  )

  const [programSolVault] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_sol_vault")],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  )
  const programTokenVault =
    await anchor.utils.token.associatedAddress({
      mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
      owner: vaultAuthority,
    })

  const referrerTokenAccount =
    await anchor.utils.token.associatedAddress({
      mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
      owner: referrerAddress,
    })

  // PDA for user
  const [userAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("user_account"),
      wallet.adapter.publicKey.toBuffer(),
    ],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  )

  const [referrerAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_account"), referrerAddress.toBuffer()],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  )

  // Get user's WSOL ATA

  const result = {
    tokenMintAuthority,
    vaultAuthority,
    programSolVault,
    programTokenVault,
    referrerTokenAccount,
    userAccount,
    referrerAccount,
  }

  return result
}

export async function getUserWsolAccount(wallet: Wallet) {
  // Derivar ATA para o novo usuário (para WSOL)
  const userWsolAccount = await utils.token.associatedAddress({
    mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
    owner: wallet.adapter.publicKey,
  })

  return {
    userWsolAccount,
    needsWsol: true,
  }
}

/**
 * Sets up the token account for the referrer
 */
async function setupReferrerTokenAccount(
  referrerAddress: PublicKey,
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet
) {
  // Calculate ATA address for referrer
  const { referrerTokenAccount } = await getNeededDerivedPDA(wallet)

  // Check if ATA already exists
  try {
    const tokenAccountInfo = await connection.getAccountInfo(
      referrerTokenAccount
    )

    if (!tokenAccountInfo) {
      const createATAIx =
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
          referrerTokenAccount,
          referrerAddress,
          wallet.adapter.publicKey
        )

      const tx = new web3.Transaction().add(createATAIx)
      tx.feePayer = wallet.adapter.publicKey
      const { blockhash } = await connection.getLatestBlockhash()
      tx.recentBlockhash = blockhash

      try {
        const signedTx = await anchorWallet.signTransaction(tx)
        const txid = await connection.sendRawTransaction(
          signedTx.serialize()
        )
        await connection.confirmTransaction(txid, "confirmed")
      } catch (e) {
        ErrorService.onError(e)
        // Check again if ATA was created despite error
        await connection.getAccountInfo(referrerTokenAccount)
      }
    }

    return referrerTokenAccount
  } catch (e) {
    ErrorService.onError(e)
    return referrerTokenAccount
  }
}

/**
 * Sets up the vault token account
 */
async function setupVaultTokenAccount(
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet
) {
  const { programTokenVault, vaultAuthority } =
    await getNeededDerivedPDA(wallet)

  // Check if ATA already exists
  try {
    const vaultAccountInfo = await connection.getAccountInfo(
      programTokenVault
    )

    if (!vaultAccountInfo) {
      const createATAIx =
        Token.createAssociatedTokenAccountInstruction(
          MAIN_ADDRESSESS_CONFIG.ASSOCIATED_TOKEN_PROGRAM_ID,
          MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID,
          MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
          programTokenVault,
          vaultAuthority,
          wallet.adapter.publicKey
        )

      const tx = new web3.Transaction().add(createATAIx)
      tx.feePayer = wallet.adapter.publicKey
      const { blockhash } = await connection.getLatestBlockhash()
      tx.recentBlockhash = blockhash

      try {
        const signedTx = await anchorWallet.signTransaction(tx)
        const txid = await connection.sendRawTransaction(
          signedTx.serialize(),
          {
            skipPreflight: true,
            maxRetries: 5,
          }
        )
        await connection.confirmTransaction(txid, "confirmed")
      } catch (e) {
        ErrorService.onError(e)
        // Check again if ATA was created despite error
        await connection.getAccountInfo(programTokenVault)
      }
    }

    return programTokenVault
  } catch (e) {
    ErrorService.onError(e)
    return programTokenVault
  }
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
  amount: string | number
  connection: Connection
  program: Program<Idl>
  wallet: Wallet
  anchorWallet: AnchorWallet
  notificationService: NotificationsService<typeof store>
  lookupTableAccount: AddressLookupTableAccount
}) {
  try {
    // Get referrer from localStorage or default
    const referrerAddress = localStorage.getItem("sponsor")
      ? new PublicKey(localStorage.getItem("sponsor") as string)
      : MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS

    // Convert amount to lamports
    const FIXED_DEPOSIT_AMOUNT =
      typeof amount === "string"
        ? new anchor.BN(amount)
        : new anchor.BN(amount)

    // Get referrer account
    const [referrerAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_account"), referrerAddress.toBuffer()],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    )

    // Check referrer
    let referrerInfo
    try {
      referrerInfo = await program.account.userAccount.fetch(
        referrerAccount
      )
      if (!referrerInfo.isRegistered) {
        console.error("❌ ERROR: Referrer is not registered!")
        return null
      }

      const nextSlotIndex = referrerInfo.chain.filledSlots

      if (nextSlotIndex >= 3) {
        return null
      }
    } catch (e) {
      console.error("❌ Error checking referrer:", e)
      return null
    }

    // Check user account
    const [userAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_account"),
        wallet.adapter.publicKey.toBuffer(),
      ],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    )

    try {
      const userInfo = await program.account.userAccount.fetch(
        userAccount
      )
      if (userInfo.isRegistered) {
        return notificationService.info({
          title: "Ops!",
          message: "already_registered",
        })
      }
    } catch (e) {}

    // Get needed PDAs
    const {
      tokenMintAuthority,
      vaultAuthority,
      programSolVault,
      programTokenVault,
      referrerTokenAccount,
    } = await getNeededDerivedPDA(wallet)

    const { userWsolAccount } = await getUserWsolAccount(wallet)

    // Setup accounts
    await setupVaultTokenAccount(connection, wallet, anchorWallet)
    await setupReferrerTokenAccount(
      referrerAddress,
      connection,
      wallet,
      anchorWallet
    )

    // Prepare uplines for recursion if needed
    let remainingAccounts = []
    const isSlot3 = referrerInfo.chain.filledSlots === 2

    if (
      isSlot3 &&
      referrerInfo.upline &&
      referrerInfo.upline.upline
    ) {
      try {
        const uplines = referrerInfo.upline.upline.map(
          (entry) => entry.pda
        )
        if (uplines.length > 0) {
          remainingAccounts = await prepareUplinesForRecursion(
            uplines,
            program,
            connection,
            wallet
          )
        }
      } catch (e) {
        return null
      }
    }

    // Prepare versioned transaction

    // Set compute unit limit and priority
    const modifyComputeUnits =
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 1_400_000,
      })

    const setPriority = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 5000,
    })

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
    ]

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
    ]

    const allRemainingAccounts = [
      ...vaultAAccounts,
      ...chainlinkAccounts,
      ...remainingAccounts,
    ]

    // Verificar se os índices 3 e 4 têm os endereços corretos

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
      .instruction()

    // Create versioned transaction
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash()

    const ixData = registerIx.data

    const manualRegisterInstruction = new TransactionInstruction({
      keys: registerIx.keys,
      programId: MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID,
      data: ixData,
    })

    const messageV0 = new TransactionMessage({
      payerKey: wallet.adapter.publicKey,
      recentBlockhash: blockhash,
      instructions: [
        modifyComputeUnits,
        setPriority,
        manualRegisterInstruction,
      ],
    }).compileToV0Message([lookupTableAccount])

    const transaction = new VersionedTransaction(messageV0)

    // Sign transaction
    const solanaPhantom = window?.phantom?.solana

    let signedTx

    if (solanaPhantom?.isSolana) {
      signedTx = await solanaPhantom.signAndSendTransaction(
        transaction
      )
    } else {
      signedTx = await anchorWallet.signTransaction(transaction)
    }

    // Send transaction
    const txid = await connection.sendRawTransaction(
      signedTx.serialize(),
      {
        skipPreflight: true,
        maxRetries: 5,
      }
    )

    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(
      {
        signature: txid,
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
      },
      "confirmed"
    )

    if (confirmation.value.err) {
      throw new Error(
        `Error confirming transaction: ${JSON.stringify(
          confirmation.value.err
        )}`
      )
    }

    return txid
  } catch (error) {
    ErrorService.onError(error)
    throw error
  }
}
