import { PublicKey } from "@solana/web3.js";

export const MAIN_ADDRESSESS_CONFIG = {
  REFERRER_ADDRESS: new PublicKey(
    process.env.NEXT_PUBLIC_REFERRER_ADDRESS as string
  ),
  MATRIX_PROGRAM_ID: new PublicKey(
    process.env.NEXT_PUBLIC_MATRIX_PROGRAM_ID as string
  ),
  TOKEN_MINT: new PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT as string),
  STATE_ADDRESS: new PublicKey(process.env.NEXT_PUBLIC_STATE_ADDRESS as string),
  SPL_TOKEN_PROGRAM_ID: new PublicKey(
    process.env.NEXT_PUBLIC_SPL_TOKEN_PROGRAM_ID as string
  ),
  ASSOCIATED_TOKEN_PROGRAM_ID: new PublicKey(
    process.env.NEXT_PUBLIC_ASSOCIATED_TOKEN_PROGRAM_ID as string
  ),
  PYTH_SOL_USD: new PublicKey(process.env.NEXT_PUBLIC_PYTH_SOL_USD as string),
  WSOL_MINT: new PublicKey(process.env.NEXT_PUBLIC_WSOL_MINT as string),
  POOL_ADDRESS: new PublicKey(process.env.NEXT_PUBLIC_POOL_ADDRESS as string),
  B_VAULT: new PublicKey(process.env.NEXT_PUBLIC_B_VAULT as string),
  B_TOKEN_VAULT: new PublicKey(process.env.NEXT_PUBLIC_B_TOKEN_VAULT as string),
  B_VAULT_LP_MINT: new PublicKey(
    process.env.NEXT_PUBLIC_B_VAULT_LP_MINT as string
  ),
  B_VAULT_LP: new PublicKey(process.env.NEXT_PUBLIC_B_VAULT_LP as string),
  VAULT_PROGRAM: new PublicKey(process.env.NEXT_PUBLIC_VAULT_PROGRAM as string),
  LOOKUP_TABLE_ADDRESS: new PublicKey(
    process.env.NEXT_PUBLIC_LOOKUP_TABLE_ADDRESS as string
  ),
  A_VAULT: new PublicKey(process.env.NEXT_PUBLIC_A_VAULT as string),
  A_TOKEN_VAULT: new PublicKey(process.env.NEXT_PUBLIC_A_TOKEN_VAULT as string),
  A_VAULT_LP: new PublicKey(process.env.NEXT_PUBLIC_A_VAULT_LP as string),
  A_VAULT_LP_MINT: new PublicKey(
    process.env.NEXT_PUBLIC_A_VAULT_LP_MINT as string
  ),
  CHAINLINK_PROGRAM: new PublicKey(
    process.env.NEXT_PUBLIC_CHAINLINK_PROGRAM as string
  ),
  SOL_USD_FEED: new PublicKey(process.env.NEXT_PUBLIC_SOL_USD_FEED as string),
};
