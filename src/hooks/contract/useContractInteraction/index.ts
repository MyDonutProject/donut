import { useSetupReferrerTokenAccount } from "@/api/contracts/queries/useSetupReferrerTokenAccount";
import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";

export default function useContractInteraction() {
  const { data: referrerTokenAccount } = useSetupReferrerTokenAccount({
    referrerAddress: MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS.toBase58(),
  });

  return {
    referrerTokenAccount,
  };
}
