import { PaginatedResponse } from "@/models/pagination"
import { Dispatch, SetStateAction } from "react"

export interface UsePaginatedQueryProps<T> {
  data?: PaginatedResponse<T>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  queryParams?: object
}

export interface UsePaginatedQueryResponse {
  setCurrentPage(page: number): void
  fetchNextPage: VoidFunction
  fetchPreviousPage: VoidFunction
}
