import { useProgram } from "@/hooks/contract/useProgram";
import { GenericError } from "@/models/generic-error";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { BalanceQueryKeys } from "../../queryKeys";
import { UserBalance, UseUserBalanceQueryKeyProps } from "./props";
import { fetchUserBalance } from "./service";

export function useUserBalance() {
  const { program } = useProgram();
  const { wallet } = useWallet();

  const queryKey: UseUserBalanceQueryKeyProps = [BalanceQueryKeys.Balance];

  const { data, isFetching, error, refetch, ...query } = useQuery<
    UserBalance,
    AxiosError<GenericError>,
    UserBalance,
    UseUserBalanceQueryKeyProps
  >({
    queryKey,
    refetchOnWindowFocus: "always",
    queryFn: (context) =>
      fetchUserBalance({ ...context, wallet: wallet, program }),
    enabled: !!wallet && typeof window !== "undefined",
  });

  useEffect(() => {
    refetch();
  }, [wallet]);

  return {
    data,
    isFetching,
    error,
    refetch,
    ...query,
  };
}
