import { useProgram } from "@/hooks/contract/useProgram";
import useIsHomePage from "@/hooks/layout/useIsHomePage";
import { Account } from "@/models/account";
import { GenericError } from "@/models/generic-error";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import { AccountQueryKeys } from "../../queryKeys";
import { UseUserAccountQueryKeyProps } from "./props";
import { fetchUserAccount } from "./service";

export function useUserAccount() {
  const { program } = useProgram();
  const wallet = useWallet();
  const isFirstConnection = useRef<boolean>(true);

  const { isHomePage } = useIsHomePage();
  const { push } = useRouter();

  const queryKey: UseUserAccountQueryKeyProps = [AccountQueryKeys.UserAccount];

  const { data, isFetching, error, refetch, ...query } = useQuery<
    Account,
    AxiosError<GenericError>,
    Account,
    UseUserAccountQueryKeyProps
  >({
    queryKey,
    retry: false,
    staleTime: 30000,
    queryFn: (context) =>
      fetchUserAccount({ ...context, wallet: wallet?.wallet, program }),
    enabled: !!wallet && typeof window !== "undefined",
  });

  // Handle initial wallet connection navigation

  console.log(wallet.connected, isFirstConnection.current, isHomePage);
  useEffect(() => {
    if (wallet.connected && isFirstConnection.current && isHomePage) {
      isFirstConnection.current = false;
      push("/dashboard");
    }
  }, [wallet, push, isHomePage]);

  const voucherUrl = useMemo(() => {
    if (!data) {
      return null;
    }

    return `${
      process.env.NEXT_PUBLIC_APP_URL
    }?sponsor=${wallet?.wallet?.adapter?.publicKey?.toBase58()}`;
  }, [data, wallet?.wallet?.adapter?.publicKey]);

  return {
    data: data
      ? {
          ...data,
          reservedTokens: Number(data.reservedTokens) / 1e9,
          reservedSol: Number(data.reservedSol) / 1e9,
        }
      : undefined,
    voucherUrl,
    isFetching,
    error,
    refetch,
    ...query,
  };
}
