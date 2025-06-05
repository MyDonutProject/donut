import { GenericError } from "@/models/generic-error"
import { useWallet } from "@solana/wallet-adapter-react"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { ReferralVouchersEmailsQueryKeys } from "../../queryKeys"
import {
  UseReferralVouchersQueryKeyProps,
  UseReferralVouchersQueryProps,
} from "./props"
import { fetchReferralVouchers } from "./service"
import { useUserAccount } from "@/api/account"
import { PaginatedResponse } from "@/models/pagination"
import { useEffect } from "react"
import { ReferralVoucher } from "@/models/referral-vouchers"

export function useReferralVouchers(
  options?: UseReferralVouchersQueryProps
) {
  const { externalOnSuccess, enabled = true } = options ?? {}
  const { wallet } = useWallet()
  const { data: userAccount } = useUserAccount()

  const filter: { address: string } = {
    address: wallet?.adapter?.publicKey?.toBase58() ?? "",
  }

  const queryKey: UseReferralVouchersQueryKeyProps = [
    ReferralVouchersEmailsQueryKeys.Primary,
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
    PaginatedResponse<ReferralVoucher> | null,
    AxiosError<GenericError>,
    PaginatedResponse<ReferralVoucher> | null,
    UseReferralVouchersQueryKeyProps
  >({
    queryKey,
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
    refetchOnMount: "always",
    queryFn: fetchReferralVouchers,
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

  useEffect(handleExternalOnSuccess, [data, enabled])

  return {
    data,
    isFetching,
    error,
    isPending: isPending && fetchStatus !== "idle",
    refetch,
    ...query,
  }
}
