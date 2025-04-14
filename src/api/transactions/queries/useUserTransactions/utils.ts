import {
  ConfirmedSignatureInfo,
  Connection,
  ParsedInstruction,
  ParsedTransactionWithMeta,
  PublicKey,
} from "@solana/web3.js";

/**
 * Fetch recent signatures for a wallet
 * @param {Connection} connection - Solana connection object
 * @param {PublicKey} walletPublicKey - Wallet public key
 * @param {number} limit - Maximum number of signatures to fetch
 * @returns {Promise<Array>} Array of signature info objects
 */
export const fetchWalletSignatures = async (
  connection: Connection,
  walletPublicKey: PublicKey,
  limit = 20
): Promise<ParsedTransactionWithMeta[]> => {
  try {
    const signatures: ConfirmedSignatureInfo[] =
      await connection.getSignaturesForAddress(walletPublicKey, { limit });

    const filteredSignatures = signatures.filter((sig) => sig.err === null);

    const transactions = await Promise.all(
      filteredSignatures.map(async (sig) => {
        const tx = await connection.getParsedTransaction(
          sig.signature,
          "confirmed"
        );
        return tx;
      })
    );

    const filteredTransactions = transactions.filter((tx) => {
      return tx?.meta?.innerInstructions?.some((ix) => {
        return ix.instructions.some((i) => {
          return (
            (i as ParsedInstruction).parsed?.info?.destination ===
            walletPublicKey.toBase58()
          );
        });
      });
    });

    const myTransactions = filteredTransactions.filter((tx) => {
      return tx?.meta?.postTokenBalances?.some((t) => {
        return t.owner !== walletPublicKey.toBase58();
      });
    });

    console.log("[fetchWalletSignatures] My transactions:", myTransactions);

    return myTransactions;
  } catch (error) {
    console.error("Error fetching wallet signatures:", error);
    throw error;
  }
};
