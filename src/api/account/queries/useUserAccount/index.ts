import { useProgram } from "@/hooks/contract/useProgram";
import { Account } from "@/models/account";
import { GenericError } from "@/models/generic-error";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo } from "react";
import { AccountQueryKeys } from "../../queryKeys";
import { UseUserAccountQueryKeyProps } from "./props";
import { fetchUserAccount } from "./service";

export function useUserAccount() {
  const { program } = useProgram();
  const { wallet } = useWallet();

  const queryKey: UseUserAccountQueryKeyProps = [AccountQueryKeys.UserAccount];

  const { data, isFetching, error, refetch, ...query } = useQuery<
    Account,
    AxiosError<GenericError>,
    Account,
    UseUserAccountQueryKeyProps
  >({
    queryKey,
    retry: 2,
    queryFn: (context) =>
      fetchUserAccount({ ...context, wallet: wallet, program }),
    enabled: !!wallet && typeof window !== "undefined",
  });

  const voucherUrl = useMemo(() => {
    if (!data) {
      return null;
    }

    return `${
      process.env.NEXT_PUBLIC_APP_URL
    }?sponsor=${wallet?.adapter?.publicKey?.toBase58()}`;
  }, [data, wallet]);

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
