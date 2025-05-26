import { Connection, ParsedInstruction } from "@solana/web3.js"
import { Transaction } from "@/models/transactions"
import { Decimal } from "@/lib/Decimal"

export async function extractUserTransactions(
  transactions: Transaction[],
  userAddress: string,
  connection: Connection
): Promise<Transaction[]> {
  if (!transactions || !userAddress) {
    return []
  }

  const results = await Promise.all(
    transactions
      .filter(async (tx) => {
        const signature = await connection.getParsedTransaction(
          tx.hash,
          {
            maxSupportedTransactionVersion: 0,
          }
        )

        const accounts = signature?.transaction?.message?.accountKeys
        const isUserTransaction = accounts.some(
          (account) => account.pubkey.toBase58() === userAddress
        )
        return isUserTransaction
      })
      .map(async (tx) => {
        const signature = await connection.getParsedTransaction(
          tx.hash,
          {
            maxSupportedTransactionVersion: 0,
          }
        )

        const tokens = signature.meta?.postTokenBalances || []

        const userTokenBalance = tokens.find(
          (token) =>
            token.owner?.toString() === userAddress?.toString()
        )

        const userTransfer: ParsedInstruction =
          signature?.meta?.innerInstructions
            ?.flatMap((instruction) => instruction?.instructions)
            .find((i) => {
              const parsed = "parsed" in i ? i.parsed : i
              return (
                parsed?.type === "transfer" &&
                parsed?.info?.destination === userAddress
              )
            }) as ParsedInstruction

        const tokenResult: Transaction = {
          ...tx,
          hash: signature?.transaction?.signatures[0],
          createdAt: signature.blockTime
            ? new Date(signature.blockTime * 1000).toISOString()
            : new Date().toISOString(),
          amount: Decimal.fromSubunits(
            userTokenBalance?.uiTokenAmount?.amount,
            { scale: 9 }
          ),
          symbol: "DNT",
        }

        const solResult: Transaction = {
          ...tx,
          hash: signature?.transaction?.signatures[0],
          createdAt: signature.blockTime
            ? new Date(signature.blockTime * 1000).toISOString()
            : new Date().toISOString(),
          amount: Decimal.fromSubunits(
            String(userTransfer?.parsed?.info?.lamports),
            { scale: 9 }
          ),
          symbol: "SOL",
        }

        return [tokenResult, solResult]
      })
  )

  return results.flat()
}
