// Core functions for tracking Solana token transactions
// Using @solana/wallet-adapter-react and @project-serum/anchor

import { QueryFunctionContext } from "@tanstack/react-query"
import { UseUserMatricesQueryKeyProps } from "./props"
import { PaginatedResponse } from "@/models/pagination"
import baseAPI from "@/api"
import { Matrix } from "@/models/matrices"

/**
 * Main function to fetch all token transactions for a wallet
 * @param {Connection} connection - Solana connection object
 * @param {PublicKey} walletPublicKey - Wallet public key
 * @param {number} limit - Maximum number of transactions to fetch
 * @returns {Promise<Array>} Array of processed token transactions
 */
export const fetchUserMatrices = async ({
  queryKey,
}: QueryFunctionContext<UseUserMatricesQueryKeyProps>): Promise<
  PaginatedResponse<Matrix>
> => {
  const { page, limit, address } = queryKey[1]
  try {
    const response = await baseAPI.get<PaginatedResponse<Matrix>>(
      `/matrices`,
      {
        params: {
          page,
          limit,
          address,
        },
      }
    )

    return response.data
  } catch (error) {
    console.error("Error fetching token transactions:", error)
    throw error
  }
}
