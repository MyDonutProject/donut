import useAccount from "@/hooks/account/useAccount";
import { GenericError } from "@/models/generic-error";
import { Provider, useAppKitProvider } from "@reown/appkit/react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ContractQueryKeys } from "../../queryKeys";
import {
  UseSetupReferrerTokenAccountProps,
  UseSetupReferrerTokenAccountQueryKeyProps,
} from "./props";
import { fetchSetupReferrerTokenAccount } from "./service";

// Create ATA for referrer
export function useSetupReferrerTokenAccount({
  referrerAddress,
}: UseSetupReferrerTokenAccountProps) {
  const { address, connection, isConnected } = useAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");

  const queryKey: UseSetupReferrerTokenAccountQueryKeyProps = [
    ContractQueryKeys.REFERRER_TOKEN_ACCOUNT,
    { referrerAddress, address },
  ];

  const { data, isFetching, error, refetch, ...query } = useQuery<
    any,
    AxiosError<GenericError>,
    any,
    UseSetupReferrerTokenAccountQueryKeyProps
  >({
    queryKey,
    retry: false,
    queryFn: (context) =>
      fetchSetupReferrerTokenAccount({
        ...context,
        //@ts-ignore
        connection,
        //@ts-ignore
        walletProvider,
      }),
    enabled: !!referrerAddress && isConnected,
  });

  return {
    data,
    isFetching,
    error,
    refetch,
    ...query,
  };
}
