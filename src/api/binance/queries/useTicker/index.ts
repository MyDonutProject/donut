import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { GenericError } from "@/models/generic-error"
import { BinanceQueryKeys } from "../../enums"
import {
  UseBinanceTickerQueryKeyProps,
  FetchBinanceTickerInputDto,
  BinanceTicker,
} from "./props"
import { fetchBinanceTicker } from "./service"
import { useMemo } from "react"
import { Decimal } from "@/lib/Decimal"

export function useBinanceTicker({
  symbol,
}: FetchBinanceTickerInputDto) {
  const queryKey: UseBinanceTickerQueryKeyProps = [
    BinanceQueryKeys.Ticker,
    { symbol },
  ]

  const { data, isFetching, error, refetch, ...query } = useQuery<
    BinanceTicker,
    AxiosError<GenericError>,
    BinanceTicker,
    UseBinanceTickerQueryKeyProps
  >({
    queryKey,
    refetchInterval: 5000,
    queryFn: fetchBinanceTicker,
  })

  const formatedData = useMemo(() => {
    if (!data) return

    return {
      ...data,
      priceChange: new Decimal(data?.priceChange, { scale: 9 }),
      priceChangePercent: new Decimal(data?.priceChangePercent, {
        scale: 2,
      }),
      weightedAvgPrice: new Decimal(data?.weightedAvgPrice, {
        scale: 9,
      }),
      prevClosePrice: new Decimal(data?.prevClosePrice, { scale: 9 }),
      lastPrice: new Decimal(data?.lastPrice, { scale: 9 }),
      lastQty: new Decimal(data?.lastQty, { scale: 9 }),
      bidPrice: new Decimal(data?.bidPrice, { scale: 9 }),
      bidQty: new Decimal(data?.bidQty, { scale: 9 }),
      askPrice: new Decimal(data?.askPrice, { scale: 9 }),
      askQty: new Decimal(data?.askQty, { scale: 9 }),
      openPrice: new Decimal(data?.openPrice, { scale: 9 }),
      highPrice: new Decimal(data?.highPrice, { scale: 9 }),
      lowPrice: new Decimal(data?.lowPrice, { scale: 9 }),
      volume: new Decimal(data?.volume, { scale: 9 }),
      quoteVolume: new Decimal(data?.quoteVolume, { scale: 9 }),
    }
  }, [data])

  return {
    data: formatedData,
    isFetching,
    error,
    refetch,
    ...query,
  }
}
