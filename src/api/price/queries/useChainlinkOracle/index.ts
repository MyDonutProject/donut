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
import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react"

export function useChainlinkOracle() {
  const dispatch = useDispatch()
  const { connection } = useConnection()
  const { wallet } = useWallet()

  const [lastFetchedAt, setLastFetchedAt] = useState<Date>(new Date())

  const queryKey: UseChainlinkOracleQueryKeyProps = [
    PriceQueryKeys.Price,
    {
      programId: process.env.NEXT_PUBLIC_CHAINLINK_PROGRAM,
      feedAddress: process.env.NEXT_PUBLIC_SOL_USD_FEED,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
    },
  ]

  //@ts-ignore
  const { data, isFetching, error, refetch, ...query } = useQuery<
    PriceFeed,
    AxiosError<GenericError>,
    PriceFeed,
    UseChainlinkOracleQueryKeyProps
  >({
    queryKey,
    queryFn: (context) => fetchSolPrice(context, connection, wallet),
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    cacheTime: 60 * 1000, // Keep in cache for 1 minute
    refetchInterval: 15 * 1000, // Refetch every minute
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
