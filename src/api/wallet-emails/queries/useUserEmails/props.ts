import { PaginatedRequest } from "@/models/pagination"
import { WalletEmailsQueryKeys } from "../../queryKeys"
import { WalletEmail } from "@/models/wallet/emails"
import { Nullable } from "@/interfaces/nullable"

export type UseWalletEmailsQueryKeyProps = [
  WalletEmailsQueryKeys.Primary,
  PaginatedRequest & { address: string }
]

export type UseWalletEmailsQueryProps = {
  externalOnSuccess?: (data: Nullable<WalletEmail>) => void
  enabled?: boolean
}
