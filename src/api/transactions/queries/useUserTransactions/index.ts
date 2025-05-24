import { GenericError } from "@/models/generic-error"
import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react"
import { ParsedTransactionWithMeta } from "@solana/web3.js"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useEffect, useMemo, useState } from "react"
import { TransactionQueryKeys } from "../../queryKeys"
import { UseUserTransactionsQueryKeyProps } from "./props"
import { fetchUserTransactions } from "./service"
import {
  PaginatedRequest,
  PaginatedResponse,
} from "@/models/pagination"
import { Transaction } from "@/models/transactions"
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery"

export function useUserTransactions() {
  const [page, setPage] = useState<number>(1)
  const { wallet } = useWallet()

  const filter: PaginatedRequest & { address: string } = {
    page,
    limit: 10,
    address: wallet?.adapter?.publicKey?.toBase58() ?? "",
  }

  const queryKey: UseUserTransactionsQueryKeyProps = [
    TransactionQueryKeys.Transaction,
    filter,
  ]

  const { data, isFetching, error, refetch, ...query } = useQuery<
    PaginatedResponse<Transaction>,
    AxiosError<GenericError>,
    PaginatedResponse<Transaction>,
    UseUserTransactionsQueryKeyProps
  >({
    queryKey,
    refetchOnWindowFocus: true,
    staleTime: 3000,
    refetchOnMount: "always",
    queryFn: fetchUserTransactions,
    enabled: !!wallet && typeof window !== "undefined",
  })

  const paginatedCallbacks = usePaginatedQuery({
    data,
    page,
    setPage,
    queryParams: {
      address: wallet?.adapter?.publicKey?.toBase58() ?? "",
    },
  })

  return {
    data,
    isFetching,
    error,
    refetch,
    ...query,
    ...paginatedCallbacks,
  }
}
