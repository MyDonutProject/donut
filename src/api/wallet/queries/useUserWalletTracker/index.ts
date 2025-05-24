import { GenericError } from "@/models/generic-error"
import { useWallet } from "@solana/wallet-adapter-react"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useState } from "react"
import { WalletQueryKeys } from "../../queryKeys"
import { UseUserWalletTrackerQueryKeyProps } from "./props"
import { fetchUserWalletTracker } from "./service"
import {
  PaginatedRequest,
  PaginatedResponse,
} from "@/models/pagination"
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery"
import { Matrix } from "@/models/matrices"
import { WalletTracker } from "@/models/wallet-tracker"
import { Nullable } from "@/interfaces/nullable"

export function useUserWalletTracker() {
  const { wallet } = useWallet()

  const filter: { address: string } = {
    address: wallet?.adapter?.publicKey?.toBase58() ?? "",
  }

  const queryKey: UseUserWalletTrackerQueryKeyProps = [
    WalletQueryKeys.Wallet,
    filter,
  ]

  const { data, isFetching, error, refetch, ...query } = useQuery<
    Nullable<WalletTracker>,
    AxiosError<GenericError>,
    Nullable<WalletTracker>,
    UseUserWalletTrackerQueryKeyProps
  >({
    queryKey,
    refetchOnWindowFocus: true,
    staleTime: 3000,
    refetchOnMount: "always",
    queryFn: fetchUserWalletTracker,
    enabled: !!wallet && typeof window !== "undefined",
  })

  return {
    data,
    isFetching,
    error,
    refetch,
    ...query,
  }
}
