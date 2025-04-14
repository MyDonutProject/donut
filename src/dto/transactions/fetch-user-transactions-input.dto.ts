import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

export interface FetchUserTransactionsRequestDto {
  wallet: Wallet;
  connection: Connection;
  limit?: number;
}
