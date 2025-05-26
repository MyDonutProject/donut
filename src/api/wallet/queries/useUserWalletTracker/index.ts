import { GenericError } from "@/models/generic-error"
import { useWallet } from "@solana/wallet-adapter-react"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { WalletQueryKeys } from "../../queryKeys"
import { UseUserWalletTrackerQueryKeyProps } from "./props"
import { fetchUserWalletTracker } from "./service"
import { WalletTracker } from "@/models/wallet-tracker"
import { Nullable } from "@/interfaces/nullable"
import { useUserAccount } from "@/api/account"

export function useUserWalletTracker() {
  const { wallet } = useWallet()
  const { data: userAccount } = useUserAccount()

  const filter: { address: string } = {
    address: wallet?.adapter?.publicKey?.toBase58() ?? "",
  }

  const queryKey: UseUserWalletTrackerQueryKeyProps = [
    WalletQueryKeys.Wallet,
    filter,
  ]

  const {
    data,
    isFetching,
    error,
    refetch,
    isPending,
    fetchStatus,
    ...query
  } = useQuery<
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
    enabled:
      !!wallet &&
      typeof window !== "undefined" &&
      !!userAccount &&
      userAccount?.isRegistered === true,
  })

  return {
    data,
    isFetching,
    error,
    isPending: isPending && fetchStatus !== "idle",
    refetch,
    ...query,
  }
}
