import {
  PaginatedRequest,
  PaginatedResponse,
} from "@/models/pagination"
import { ReferralVouchersEmailsQueryKeys } from "../../queryKeys"
import { ReferralVoucher } from "@/models/referral-vouchers"

export type UseReferralVouchersQueryKeyProps = [
  ReferralVouchersEmailsQueryKeys.Primary,
  PaginatedRequest & { address: string }
]

export type UseReferralVouchersQueryProps = {
  externalOnSuccess?: (
    data: PaginatedResponse<ReferralVoucher>
  ) => void
  enabled?: boolean
}
