// Core functions for tracking Solana token transactions
// Using @solana/wallet-adapter-react and @project-serum/anchor

import { QueryFunctionContext } from "@tanstack/react-query"
import { UseUserWalletTrackerQueryKeyProps } from "./props"
import { PaginatedResponse } from "@/models/pagination"
import baseAPI from "@/api"
import { Matrix } from "@/models/matrices"
import { WalletTracker } from "@/models/wallet-tracker"
import { Nullable } from "@/interfaces/nullable"

/**
 * Main function to fetch all token transactions for a wallet
 * @param {Connection} connection - Solana connection object
 * @param {PublicKey} walletPublicKey - Wallet public key
 * @param {number} limit - Maximum number of transactions to fetch
 * @returns {Promise<Array>} Array of processed token transactions
 */
export const fetchUserWalletTracker = async ({
  queryKey,
}: QueryFunctionContext<UseUserWalletTrackerQueryKeyProps>): Promise<
  Nullable<WalletTracker>
> => {
  const { address } = queryKey[1]
  try {
    const response = await baseAPI.get<Nullable<WalletTracker>>(
      `/wallets/tracker/${address}`
    )

    return response.data
  } catch (error) {
    console.error("Error fetching token transactions:", error)
    throw error
  }
}
