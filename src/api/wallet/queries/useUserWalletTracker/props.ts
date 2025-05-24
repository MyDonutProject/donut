import { PaginatedRequest } from "@/models/pagination"
import { WalletQueryKeys } from "../../queryKeys"

export type UseUserWalletTrackerQueryKeyProps = [
  WalletQueryKeys.Wallet,
  PaginatedRequest & { address: string }
]
