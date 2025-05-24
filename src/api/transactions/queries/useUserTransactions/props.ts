import { PaginatedRequest } from "@/models/pagination"
import { TransactionQueryKeys } from "../../queryKeys"

export type UseUserTransactionsQueryKeyProps = [
  TransactionQueryKeys.Transaction,
  PaginatedRequest & { address: string }
]
