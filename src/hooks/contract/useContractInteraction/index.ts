import { useSetupReferrerTokenAccount } from "@/api/contracts/queries/useSetupReferrerTokenAccount";
import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { PublicKey } from "@solana/web3.js";
export default function useContractInteraction() {
  const referrerAddress = localStorage.getItem("sponsor")
    ? new PublicKey(localStorage.getItem("sponsor") as string)
    : MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS;

  const { data: referrerTokenAccount } = useSetupReferrerTokenAccount({
    referrerAddress: referrerAddress.toBase58(),
  });

  return {
    referrerTokenAccount,
  };
}
