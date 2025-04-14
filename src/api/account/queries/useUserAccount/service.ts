import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { FetchUserAccountRequestDto } from "@/dto/account/fetch-user-account.dto";
import { Account } from "@/models/account";
import { PublicKey } from "@solana/web3.js";
import { QueryFunctionContext } from "@tanstack/react-query";
import { UseUserAccountQueryKeyProps } from "./props";

export async function fetchUserAccount({
  wallet,
  program,
}: QueryFunctionContext<UseUserAccountQueryKeyProps> &
  FetchUserAccountRequestDto): Promise<Account> {
  try {
    try {
      const [userAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_account"), wallet.adapter.publicKey.toBuffer()],
        MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
      );

      const userInfo: Account = (await program.account.userAccount.fetch(
        userAccount
      )) as unknown as Account;

      return userInfo;
    } catch (error) {
      console.error("[fetchUserAccount] Outer error:", error);
      throw error;
    }
  } catch (error) {
    console.error("[fetchUserAccount] Outer error:", error);
    throw error;
  }
}
