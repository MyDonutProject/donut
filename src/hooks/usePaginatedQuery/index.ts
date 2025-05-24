import { useCallback, useEffect, useState } from "react"
import {
  UsePaginatedQueryProps,
  UsePaginatedQueryResponse,
} from "./props"
import { Nullable } from "@/interfaces/nullable"
import { PaginatedResponse } from "@/models/pagination"
import { areObjectValuesDifferent } from "./utils"

export function usePaginatedQuery<T>({
  data,
  page,
  setPage,
  queryParams,
}: UsePaginatedQueryProps<T>): UsePaginatedQueryResponse {
  const [lastQueryParams, setLastQueryParams] =
    useState<Nullable<object>>(null)

  const setCurrentPage = useCallback(
    (newPage: number) => {
      if (page == newPage) return
      setPage(newPage)
    },
    [page, setPage]
  )

  const fetchNextPage = useCallback(() => {
    const hasNextPage: boolean =
      (data as PaginatedResponse<T>)?.metadata?.hasNextPage ?? false

    if (!hasNextPage) return

    setPage((old) => old + 1)
  }, [data, setPage, page])

  const fetchPreviousPage = useCallback(() => {
    const hasPreviousPage: boolean =
      (data as PaginatedResponse<T>)?.metadata?.hasPreviousPage ??
      false

    if (!hasPreviousPage) return

    setPage((old) => old - 1)
  }, [data, setPage, page])

  function onChangeQueryParams() {
    if (!queryParams) {
      return
    }

    if (!lastQueryParams) {
      setLastQueryParams(queryParams)
      return
    }

    if (!areObjectValuesDifferent(lastQueryParams, queryParams)) {
      return
    }

    setLastQueryParams(queryParams)
    setPage(1)
  }

  useEffect(onChangeQueryParams, [
    queryParams,
    lastQueryParams,
    setPage,
  ])

  return {
    setCurrentPage,
    fetchNextPage,
    fetchPreviousPage,
  }
}
