import { PaginatedRequest } from "@/models/pagination"
import { MatrixQueryKeys } from "../../queryKeys"

export type UseUserMatricesQueryKeyProps = [
  MatrixQueryKeys.Matrix,
  PaginatedRequest & { address: string }
]
