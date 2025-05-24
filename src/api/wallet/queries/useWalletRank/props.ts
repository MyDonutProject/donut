import { PaginatedRequest } from "@/models/pagination"
import { WalletQueryKeys } from "../../queryKeys"

export type UseUserWalletRankQueryKeyProps = [
  WalletQueryKeys.WalletRank,
  { address: string }
]
