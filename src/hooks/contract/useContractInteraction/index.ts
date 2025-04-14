import { useSetupReferrerTokenAccount } from "@/api/contracts/queries/useSetupReferrerTokenAccount";

export default function useContractInteraction() {
  const { data: referrerTokenAccount } = useSetupReferrerTokenAccount({
    referrerAddress: process.env.NEXT_PUBLIC_REFERRER_ADDRESS,
  });

  return {
    referrerTokenAccount,
  };
}
