import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { GenericError } from "@/models/generic-error"
import { fetchSolPrice } from "./service"
import { UseChainlinkOracleQueryKeyProps } from "./props"
import { PriceQueryKeys } from "../../queryKeys"
import {
  DEFAULT_SOL_PRICE,
  MAX_PRICE_FEED_AGE,
  PriceFeed,
} from "../../props"
import { useDispatch } from "react-redux"
import { setPrice } from "@/store/hermes/actions"
import { useCallback, useEffect, useState } from "react"

export function useChainlinkOracle() {
  const dispatch = useDispatch()
  const [lastFetchedAt, setLastFetchedAt] = useState<Date>(new Date())

  const queryKey: UseChainlinkOracleQueryKeyProps = [
    PriceQueryKeys.Price,
  ]

  const { data, isFetching, error, refetch, ...query } = useQuery<
    PriceFeed,
    AxiosError<GenericError>,
    PriceFeed,
    UseChainlinkOracleQueryKeyProps
  >({
    queryKey,
    queryFn: fetchSolPrice,
    refetchInterval: 15000,
    refetchOnWindowFocus: false,
  })

  const onSuccess = useCallback(() => {
    if (!data) {
      return
    }

    if (
      Date.now() - new Date(data?.startedAt).getTime() >
      MAX_PRICE_FEED_AGE * 1000
    ) {
      dispatch(setPrice(DEFAULT_SOL_PRICE.toString()))
      setLastFetchedAt(new Date())
      return
    }

    dispatch(setPrice(data?.price))
    setLastFetchedAt(new Date())
  }, [data, dispatch])

  useEffect(onSuccess, [onSuccess])

  return {
    data,
    isFetching,
    error,
    refetch,
    lastFetchedAt,
    ...query,
  }
}
