import { GenericError } from "@/models/generic-error"
import { useWallet } from "@solana/wallet-adapter-react"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { WalletEmailsQueryKeys } from "../../queryKeys"
import {
  UseWalletEmailsQueryKeyProps,
  UseWalletEmailsQueryProps,
} from "./props"
import { fetchWalletEmails } from "./service"
import { useUserAccount } from "@/api/account"
import { WalletEmail } from "@/models/wallet/emails"
import { useEffect } from "react"
import { Nullable } from "@/interfaces/nullable"

export function useWalletEmails(options?: UseWalletEmailsQueryProps) {
  const { externalOnSuccess, enabled = true } = options ?? {}
  const { wallet } = useWallet()
  const { data: userAccount } = useUserAccount()

  const filter: { address: string } = {
    address: wallet?.adapter?.publicKey?.toBase58() ?? "",
  }

  const queryKey: UseWalletEmailsQueryKeyProps = [
    WalletEmailsQueryKeys.Primary,
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
    Nullable<WalletEmail>,
    AxiosError<GenericError>,
    Nullable<WalletEmail>,
    UseWalletEmailsQueryKeyProps
  >({
    queryKey,
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
    refetchOnMount: "always",
    queryFn: fetchWalletEmails,
    enabled:
      !!wallet &&
      typeof window !== "undefined" &&
      !!userAccount &&
      userAccount?.isRegistered === true &&
      enabled,
  })

  function handleExternalOnSuccess() {
    if (
      !userAccount ||
      userAccount?.isRegistered === false ||
      !externalOnSuccess ||
      !wallet ||
      !data ||
      !enabled
    ) {
      return
    }

    externalOnSuccess(data)
  }

  useEffect(handleExternalOnSuccess, [data])

  return {
    data,
    isFetching,
    error,
    isPending: isPending && fetchStatus !== "idle",
    refetch,
    ...query,
  }
}
