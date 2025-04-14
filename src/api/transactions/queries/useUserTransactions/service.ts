// Core functions for tracking Solana token transactions
// Using @solana/wallet-adapter-react and @project-serum/anchor

import { FetchUserTransactionsRequestDto } from "@/dto/transactions/fetch-user-transactions-input.dto";
import { Connection, PublicKey } from "@solana/web3.js";
import { QueryFunctionContext } from "@tanstack/react-query";
import { UseUserTransactionsQueryKeyProps } from "./props";
import { fetchWalletSignatures } from "./utils";

/**
 * Main function to fetch all token transactions for a wallet
 * @param {Connection} connection - Solana connection object
 * @param {PublicKey} walletPublicKey - Wallet public key
 * @param {number} limit - Maximum number of transactions to fetch
 * @returns {Promise<Array>} Array of processed token transactions
 */
export const fetchUserTransactions = async ({
  connection,
  wallet,
  limit = 20,
}: QueryFunctionContext<UseUserTransactionsQueryKeyProps> &
  FetchUserTransactionsRequestDto) => {
  try {
    // Step 1: Fetch signatures
    const signatures = await fetchWalletSignatures(
      connection,
      wallet.adapter.publicKey,
      limit
    );

    return signatures;
  } catch (error) {
    console.error("Error fetching token transactions:", error);
    throw error;
  }
};
