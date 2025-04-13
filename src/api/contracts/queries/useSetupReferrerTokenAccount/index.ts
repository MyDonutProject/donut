import useAccount from "@/hooks/account/useAccount";
import { GenericError } from "@/models/generic-error";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next/client";
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
  const { connection, isConnected, address } = useAccount();
  const anchorWallet = useAnchorWallet();

  const queryKey: UseSetupReferrerTokenAccountQueryKeyProps = [
    ContractQueryKeys.REFERRER_TOKEN_ACCOUNT,
    { referrerAddress: getCookie("sponsor") ?? referrerAddress, address },
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
        anchorWallet,
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
