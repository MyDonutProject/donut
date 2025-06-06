import { PaginatedRequest } from "@/models/pagination"
import { ReferralVouchersEmailsQueryKeys } from "../../queryKeys"
import { ReferralVoucher } from "@/models/referral-vouchers"
import { Nullable } from "@/interfaces/nullable"

export type UseReferralVouchersQueryKeyProps = [
  ReferralVouchersEmailsQueryKeys.Primary,
  PaginatedRequest & { address: string }
]

export type UseReferralVouchersQueryProps = {
  externalOnSuccess?: (data: Nullable<ReferralVoucher>) => void
  enabled?: boolean
}
