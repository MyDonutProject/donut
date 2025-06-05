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

  console.log(
    `\n🔄 PREPARING ${uplinePDAs.length} UPLINES (MAX 6) FOR RECURSION`
  )

  // Collect upline information
  for (let i = 0; i < Math.min(uplinePDAs.length, 6); i++) {
    const uplinePDA = uplinePDAs[i]
    console.log(
      `  Analyzing upline ${i + 1}: ${uplinePDA.toString()}`
    )

    try {
      // Get data directly from the account
      const uplineInfo = await program.account.userAccount.fetch(
        uplinePDA
      )

      let uplineWallet

      if (uplineInfo.ownerWallet) {
        uplineWallet = uplineInfo.ownerWallet
        console.log(
          `  ✅ Wallet get from owner_wallet: ${uplineWallet.toString()}`
        )
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
            console.log(`  ✅ Entry found in UplineEntry structure`)
            break
          }
        }

        if (foundEntry) {
          // Use data from the correct entry
          uplineWallet = foundEntry.wallet
          console.log(
            `  ✅ Wallet get from correct entry: ${uplineWallet.toString()}`
          )
        } else {
          // If corresponding entry not found, use the first entry
          console.log(
            `  ⚠️ Specific entry not found, using first entry of structure`
          )
          uplineWallet = (uplineInfo.upline as any).upline[0].wallet
          console.log(`    Wallet: ${uplineWallet.toString()}`)
        }
      } else {
        // Fallback for other methods if previous options fail
        console.log(
          `  ⚠️ UplineEntry structure missing or incomplete (possible base user)`
        )
        continue
      }

      const uplineTokenAccount =
        await anchor.utils.token.associatedAddress({
          mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
          owner: uplineWallet,
        })

      console.log(
        `  💰 ATA derived for wallet: ${uplineTokenAccount.toString()}`
      )

      // Add to the trio info for sorting later
      triosInfo.push({
        pda: uplinePDA,
        wallet: uplineWallet,
        ata: uplineTokenAccount,
        depth: parseInt((uplineInfo.upline as any).depth.toString()),
      })
    } catch (e) {
      console.log(`  ❌ Error analyzing upline: ${e.message}`)
    }
  }

  // IMPORTANT: Sort trios by DESCENDING depth (higher to lower)
  triosInfo.sort((a, b) => b.depth - a.depth)

  console.log(`\n📊 UPLINE PROCESSING ORDER (Higher depth → Lower):`)
  for (let i = 0; i < triosInfo.length; i++) {
    console.log(
      `  ${i + 1}. PDA: ${triosInfo[i].pda.toString()} (Depth: ${
        triosInfo[i].depth
      })`
    )
    console.log(`    Wallet: ${triosInfo[i].wallet.toString()}`)
    console.log(`    ATA: ${triosInfo[i].ata.toString()}`)
  }

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

  // Verification to ensure we only have trios
  if (remainingAccounts.length % 3 !== 0) {
    console.error(
      "⚠️ WARNING: Number of accounts is not a multiple of 3. This indicates a problem!"
    )
  } else {
    console.log(
      `  ✅ Total uplines processed: ${remainingAccounts.length / 3}`
    )
    console.log(
      `  ✅ Total accounts added: ${remainingAccounts.length}`
    )
    console.log(
      `  ✅ Confirmed: ONLY TRIOS (PDA, wallet, ATA) being passed!`
    )
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
  console.log(
    "🔑 USER_WSOL_ACCOUNT (ATA): " + userWsolAccount.toString()
  )

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

    console.log(
      "🔍 DEBUG: Referrer token account info:",
      tokenAccountInfo ? "exists" : "does not exist"
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
        console.log(`  ✅ Referrer ATA created: ${txid}`)
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
    console.log(
      "🚀 REGISTERING USER WITH REFERRER, CHAINLINK ORACLE AND ALT 🚀"
    )

    // Get referrer from localStorage or default
    const referrerAddress = localStorage.getItem("sponsor")
      ? new PublicKey(localStorage.getItem("sponsor") as string)
      : MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS

    console.log("📋 BASIC INFORMATION:")
    console.log("🧑‍💻 New user: " + wallet.adapter.publicKey.toString())
    console.log(
      "💰 Balance: ",
      connection.getBalance(wallet.adapter.publicKey)
    )
    console.log("🧑‍🤝‍🧑 Referrer: " + referrerAddress.toString())
    console.log("💰 Deposit amount: " + amount + " SOL")

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
    console.log("📄 REFERRER PDA: " + referrerAccount.toString())

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

      console.log("✅ Referrer verified")
      console.log("🔢 Depth: " + referrerInfo.upline.depth.toString())
      console.log(
        "📊 Filled slots: " + referrerInfo.chain.filledSlots + "/3"
      )

      if (referrerInfo.ownerWallet) {
        console.log(
          "✅ Referrer has owner_wallet field: " +
            referrerInfo.ownerWallet.toString()
        )
      }

      const nextSlotIndex = referrerInfo.chain.filledSlots
      if (nextSlotIndex >= 3) {
        console.log("⚠️ WARNING: Referrer's matrix is already full!")
        return null
      }
      // 🎯 INFORMAÇÃO OTIMIZADA SOBRE WSOL
      console.log(
        "\n💡 Information about WSOL usage (via remaining_accounts):"
      )
      if (nextSlotIndex === 0) {
        console.log(
          "✅ SLOT 1 (idx 0): WSOL will be passed via remaining_accounts (position 5)"
        )
        console.log(
          "   📍 Deposit will be made in the pool using existing WSOL"
        )
      } else if (nextSlotIndex === 1) {
        console.log("ℹ️ SLOT 2 (idx 1): WSOL will not be needed")
        console.log(
          "   📍 SOL will be used directly for reserve + mint of tokens"
        )
      } else if (nextSlotIndex === 2) {
        console.log(
          "🔄 SLOT 3 (idx 2): WSOL can be used in recursion"
        )
        console.log(
          "   📍 WSOL will be passed via remaining_accounts when needed"
        )
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
        console.log("⚠️ You are already registered in the system!")
        return notificationService.info({
          title: "Ops!",
          message: "already_registered",
        })
      }
    } catch (e) {
      console.log("✅ PROCEEDING WITH REGISTRATION...")
    }

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
      console.log("\n🔄 Preparing uplines for recursion (slot 3)")
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
        console.log(`❌ Error preparing recursion: ${e.message}`)
        return null
      }
    }

    // Prepare versioned transaction
    console.log("\n📤 PREPARING VERSIONED TRANSACTION WITH ALT...")

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
    console.log("\n🔍 VERIFICANDO ORDEM DE REMAINING_ACCOUNTS:")
    console.log(
      `  Índice 3 (Feed): ${allRemainingAccounts[3].pubkey.toString()}`
    )
    console.log(
      `  Índice 4 (Programa): ${allRemainingAccounts[4].pubkey.toString()}`
    )
    console.log(
      `  Expected Feed address: ${MAIN_ADDRESSESS_CONFIG.SOL_USD_FEED.toString()}`
    )
    console.log(
      `  Expected Program address: ${MAIN_ADDRESSESS_CONFIG.CHAINLINK_PROGRAM.toString()}`
    )

    if (
      !allRemainingAccounts[3].pubkey.equals(
        MAIN_ADDRESSESS_CONFIG.SOL_USD_FEED
      ) ||
      !allRemainingAccounts[4].pubkey.equals(
        MAIN_ADDRESSESS_CONFIG.CHAINLINK_PROGRAM
      )
    ) {
      console.error(
        "❌ ERROR: The order of the Chainlink accounts is incorrect!"
      )
      return
    }

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
    console.log(
      `🔍 Generated instruction with discriminator: ${Buffer.from(
        ixData.slice(0, 8)
      ).toString("hex")}`
    )

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
    console.log("\n📤 SENDING VERSIONED TRANSACTION...")
    const txid = await connection.sendRawTransaction(
      signedTx.serialize(),
      {
        skipPreflight: true,
        maxRetries: 5,
      }
    )

    console.log("✅ Transaction sent: " + txid)
    console.log(
      `🔍 Explorer link: https://solscan.io/tx/${txid}?cluster=devnet`
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

    console.log("✅ Transaction confirmed!")

    // Verify results
    const userInfo = await program.account.userAccount.fetch(
      userAccount
    )
    console.log("\n📋 REGISTRATION CONFIRMATION:")
    console.log("✅ User registered: " + userInfo.isRegistered)
    console.log("🧑‍🤝‍🧑 Referrer: " + userInfo.referrer.toString())
    console.log(
      "🔢 Depth: " + (userInfo.upline as any).depth.toString()
    )
    console.log(
      "📊 Filled slots: " + (userInfo.chain as any).filledSlots + "/3"
    )

    // Verificar campo owner_wallet
    if (userInfo.ownerWallet) {
      console.log("\n📋 CAMPOS DA CONTA:")
      console.log(
        "👤 Owner Wallet: " + userInfo.ownerWallet.toString()
      )

      if (
        userInfo.ownerWallet &&
        (userInfo.ownerWallet as PublicKey).equals(
          wallet.adapter.publicKey
        )
      ) {
        console.log(
          "✅ O campo owner_wallet foi corretamente preenchido"
        )
      } else {
        console.log(
          "❌ ALERTA: Owner Wallet não corresponde à carteira do usuário!"
        )
      }
    }

    if (
      (userInfo.upline as any).upline &&
      (userInfo.upline as any).upline.length > 0
    ) {
      console.log("\n📋 UPLINE INFORMATION:")
      ;(userInfo.upline as any).upline.forEach(
        (entry: any, index: number) => {
          console.log(`  Upline #${index + 1}:`)
          console.log(`    PDA: ${entry.pda.toString()}`)
          console.log(`    Wallet: ${entry.wallet.toString()}`)
        }
      )
    }

    // Se estava no slot 3, verificar processamento da recursividade
    if (isSlot3 && remainingAccounts.length > 0) {
      console.log("\n🔄 VERIFICANDO RESULTADO DA RECURSIVIDADE:")

      let uplineReverseCount = 0
      for (let i = 0; i < remainingAccounts.length; i += 3) {
        if (i >= remainingAccounts.length) break

        try {
          const uplineAccount = remainingAccounts[i].pubkey

          console.log(
            `\n  Verificando upline: ${uplineAccount.toString()}`
          )

          const uplineInfo = await program.account.userAccount.fetch(
            uplineAccount
          )
          console.log(
            `  Slots preenchidos: ${
              (uplineInfo.chain as any).filledSlots
            }/3`
          )

          // Verificar se o referenciador foi adicionado à matriz do upline
          for (
            let j = 0;
            j < (uplineInfo.chain as any).filledSlots;
            j++
          ) {
            if (
              (uplineInfo.chain as any).slots[j] &&
              (uplineInfo.chain as any).slots[j].equals(
                referrerAccount
              )
            ) {
              console.log(
                `  ✅ REFERENCIADOR ADICIONADO NO SLOT ${j + 1}!`
              )
              uplineReverseCount++
              break
            }
          }

          // Verificar valores reservados
          if ((uplineInfo.reservedSol as any) > 0) {
            console.log(
              `  💰 SOL Reservado: ${
                (uplineInfo.reservedSol as any) / 1e9
              } SOL`
            )
          }

          if ((uplineInfo.reservedTokens as any) > 0) {
            console.log(
              `  🪙 Tokens Reservados: ${
                (uplineInfo.reservedTokens as any) / 1e9
              } tokens`
            )
          }
        } catch (e) {
          console.log(`  Erro ao verificar upline: ${e.message}`)
        }
      }

      console.log(
        `\n  ✅ Recursividade processou ${uplineReverseCount}/${
          remainingAccounts.length / 3
        } uplines`
      )
    }

    return txid
  } catch (error) {
    console.error("❌ ERROR DURING REGISTRATION:", error)

    if (error.logs) {
      console.log("\n📋 DETAILED ERROR LOGS:")
      error.logs.forEach((log: string, i: number) =>
        console.log(`${i}: ${log}`)
      )
    }

    ErrorService.onError(error)
    throw error
  }
}
