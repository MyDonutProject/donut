// Core functions for tracking Solana token transactions
// Using @solana/wallet-adapter-react and @project-serum/anchor

import { QueryFunctionContext } from "@tanstack/react-query"
import { UseUserTransactionsQueryKeyProps } from "./props"
import { PaginatedResponse } from "@/models/pagination"
import baseAPI from "@/api"
import { Transaction } from "@/models/transactions"
import { extractUserTransactions } from "./helper.ts"
import { Connection } from "@solana/web3.js"

/**
 * Main function to fetch all token transactions for a wallet
 * @param {Connection} connection - Solana connection object
 * @param {PublicKey} walletPublicKey - Wallet public key
 * @param {number} limit - Maximum number of transactions to fetch
 * @returns {Promise<Array>} Array of processed token transactions
 */
export const fetchUserTransactions = async ({
  queryKey,
  connection,
}: QueryFunctionContext<UseUserTransactionsQueryKeyProps> & {
  connection: Connection
}): Promise<PaginatedResponse<Transaction>> => {
  const { page, limit, address } = queryKey[1]
  try {
    const response = await baseAPI.get<
      PaginatedResponse<Transaction>
    >(`/transactions`, {
      params: {
        page,
        limit,
        address,
      },
    })

    const data = await extractUserTransactions(
      response.data.data,
      address,
      connection
    )

    return {
      ...response.data,
      data,
    }
  } catch (error) {
    console.error("Error fetching token transactions:", error)
    throw error
  }
}
