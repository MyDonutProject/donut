import { GenericError } from "@/models/generic-error"
import { useWallet } from "@solana/wallet-adapter-react"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useState } from "react"
import { MatrixQueryKeys } from "../../queryKeys"
import { UseUserMatricesQueryKeyProps } from "./props"
import { fetchUserMatrices } from "./service"
import {
  PaginatedRequest,
  PaginatedResponse,
} from "@/models/pagination"
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery"
import { Matrix } from "@/models/matrices"

export function useUserMatrices() {
  const [page, setPage] = useState<number>(1)
  const { wallet } = useWallet()

  const filter: PaginatedRequest & { address: string } = {
    page,
    limit: 10,
    address: wallet?.adapter?.publicKey?.toBase58() ?? "",
  }

  const queryKey: UseUserMatricesQueryKeyProps = [
    MatrixQueryKeys.Matrix,
    filter,
  ]

  const { data, isFetching, error, refetch, ...query } = useQuery<
    PaginatedResponse<Matrix>,
    AxiosError<GenericError>,
    PaginatedResponse<Matrix>,
    UseUserMatricesQueryKeyProps
  >({
    queryKey,
    refetchOnWindowFocus: true,
    staleTime: 3000,
    refetchInterval: 3000,
    refetchOnMount: "always",
    queryFn: fetchUserMatrices,
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
