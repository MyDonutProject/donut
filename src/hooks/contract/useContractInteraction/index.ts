import { Provider } from "@reown/appkit/react";

import { useSetupReferrerTokenAccount } from "@/api/contracts/queries/useSetupReferrerTokenAccount";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";

export default function useContractInteraction() {
  const { address } = useAppKitAccount();
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");

  const { data: referrerTokenAccount } = useSetupReferrerTokenAccount({
    referrerAddress: process.env.NEXT_PUBLIC_REFERRER_ADDRESS,
  });

  return {
    referrerTokenAccount,
  };
}
