import { Idl, Program } from "@project-serum/anchor";
import { Wallet } from "@solana/wallet-adapter-react";

export interface FetchUserAccountRequestDto {
  wallet: Wallet;
  program: Program<Idl>;
}
