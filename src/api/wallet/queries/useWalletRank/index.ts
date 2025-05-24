import { GenericError } from "@/models/generic-error"
import { useWallet } from "@solana/wallet-adapter-react"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { WalletQueryKeys } from "../../queryKeys"
import { UseUserWalletRankQueryKeyProps } from "./props"
import { Nullable } from "@/interfaces/nullable"
import { RankStatus } from "@/models/rank/status"
import { fetchUserWalletRank } from "./service"

export function useUserWalletRank() {
  const { wallet } = useWallet()

  const filter: { address: string } = {
    address: wallet?.adapter?.publicKey?.toBase58() ?? "",
  }

  const queryKey: UseUserWalletRankQueryKeyProps = [
    WalletQueryKeys.WalletRank,
    filter,
  ]

  const { data, isFetching, error, refetch, ...query } = useQuery<
    Nullable<RankStatus>,
    AxiosError<GenericError>,
    Nullable<RankStatus>,
    UseUserWalletRankQueryKeyProps
  >({
    queryKey,
    refetchOnWindowFocus: true,
    staleTime: 3000,
    refetchOnMount: "always",
    queryFn: fetchUserWalletRank,
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
