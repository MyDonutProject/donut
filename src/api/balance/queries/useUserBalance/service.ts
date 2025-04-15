import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { FetchUserAccountRequestDto } from "@/dto/account/fetch-user-account.dto";

import { PublicKey } from "@solana/web3.js";
import { QueryFunctionContext } from "@tanstack/react-query";
import { UseUserBalanceQueryKeyProps } from "./props";

export async function fetchUserBalance({
  wallet,
  program,
}: QueryFunctionContext<UseUserBalanceQueryKeyProps> &
  FetchUserAccountRequestDto) {
  try {
    try {
      const walletToBeChecked = wallet.adapter.publicKey;

      const [userAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_account"), walletToBeChecked.toBuffer()],
        MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
      );

      // Get raw account data without type casting
      const userInfo = await program.account.userAccount.fetch(userAccount);
      // const userBalance = await program.methods.getUserBalance(userAccount);

      return {
        isRegistered: userInfo.isRegistered,
        reservedSol: userInfo.reservedSol,
        reservedTokens: userInfo.reservedTokens,
        formattedSol: userInfo.reservedSol / 1e9,
        formattedTokens: userInfo.reservedTokens / 1e9,
      };
    } catch (error) {
      console.error("[fetchUserAccount] Outer error:", error);
      throw error;
    }
  } catch (error) {
    console.error("[fetchUserAccount] Outer error:", error);
    throw error;
  }
}
