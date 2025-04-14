import { GenericError } from "@/models/generic-error";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ParsedTransactionWithMeta } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo } from "react";
import { TransactionQueryKeys } from "../../queryKeys";
import { getDonuts, getSolanas } from "./helpers";
import { UseUserTransactionsQueryKeyProps } from "./props";
import { fetchUserTransactions } from "./service";

export function useUserTransactions() {
  const { wallet } = useWallet();
  const { connection } = useConnection();

  const queryKey: UseUserTransactionsQueryKeyProps = [
    TransactionQueryKeys.Transaction,
  ];

  const { data, isFetching, error, refetch, ...query } = useQuery<
    ParsedTransactionWithMeta[],
    AxiosError<GenericError>,
    ParsedTransactionWithMeta[],
    UseUserTransactionsQueryKeyProps
  >({
    queryKey,
    refetchOnWindowFocus: true,
    staleTime: 3000,
    queryFn: (context) =>
      fetchUserTransactions({
        ...context,
        wallet,
        connection,
      }),
    enabled: !!wallet && typeof window !== "undefined",
  });

  const parsedDonuts = getDonuts(data, wallet);
  const parsedSolanas = getSolanas(data, wallet);

  const sumDonuts = useMemo(() => {
    return (
      parsedDonuts?.reduce(
        (acc, curr) => acc + Number(curr.uiTokenAmount?.amount),
        0
      ) ?? 0
    );
  }, [parsedDonuts]);

  const sumSolanas = useMemo(() => {
    return (
      parsedSolanas?.reduce(
        (acc, curr) => acc + Number(curr.uiTokenAmount?.amount ?? 0),
        0
      ) ?? 0
    );
  }, [parsedSolanas]);

  return {
    data,
    isFetching,
    error,
    refetch,
    parsedDonuts,
    parsedSolanas,
    sumDonuts,
    sumSolanas,
    ...query,
  };
}
