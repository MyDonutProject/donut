import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { Wallet } from "@solana/wallet-adapter-react";
import { ParsedTransactionWithMeta } from "@solana/web3.js";

export function getDonuts(
  transactions: ParsedTransactionWithMeta[],
  wallet: Wallet
) {
  return transactions
    ?.find((tx) =>
      tx?.meta?.postTokenBalances?.some(
        (t) => t?.mint === MAIN_ADDRESSESS_CONFIG.TOKEN_MINT.toBase58()
      )
    )
    ?.meta?.postTokenBalances?.filter(
      (t) =>
        t?.mint === MAIN_ADDRESSESS_CONFIG.TOKEN_MINT.toBase58() &&
        t?.owner === wallet?.adapter.publicKey.toBase58()
    );
}

export function getSolanas(
  transactions: ParsedTransactionWithMeta[],
  wallet: Wallet
) {
  return transactions
    ?.find((tx) =>
      tx?.meta?.postTokenBalances?.some(
        (t) => t?.mint === MAIN_ADDRESSESS_CONFIG.WSOL_MINT.toBase58()
      )
    )
    ?.meta?.postTokenBalances?.filter(
      (t) =>
        t?.mint === MAIN_ADDRESSESS_CONFIG.WSOL_MINT.toBase58() &&
        t?.owner === wallet?.adapter.publicKey.toBase58()
    );
}
