// Core functions for tracking Solana token transactions
// Using @solana/wallet-adapter-react and @project-serum/anchor

import { QueryFunctionContext } from "@tanstack/react-query"
import { UseWalletEmailsQueryKeyProps } from "./props"
import baseAPI from "@/api"
import { WalletEmail } from "@/models/wallet/emails"
import { Nullable } from "@/interfaces/nullable"

/**
 * Main function to fetch all token transactions for a wallet
 * @param {Connection} connection - Solana connection object
 * @param {PublicKey} walletPublicKey - Wallet public key
 * @param {number} limit - Maximum number of transactions to fetch
 * @returns {Promise<Array>} Array of processed token transactions
 */
export const fetchWalletEmails = async ({
  queryKey,
}: QueryFunctionContext<UseWalletEmailsQueryKeyProps>): Promise<
  Nullable<WalletEmail>
> => {
  const { address } = queryKey[1]
  try {
    const response = await baseAPI.get<Nullable<WalletEmail>>(
      `/emails/${address}`
    )

    return response.data
  } catch (error) {
    console.error("Error fetching token transactions:", error)
    throw error
  }
}
