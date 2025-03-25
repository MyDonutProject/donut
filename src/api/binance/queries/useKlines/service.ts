import { BinanceKlines, UseBinanceKlinesQueryKeyProps } from './props';
import { QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';

export async function fetchBinanceKlines({
  queryKey,
}: QueryFunctionContext<UseBinanceKlinesQueryKeyProps>) {
  const { symbol, interval, startTime, endTime, timeZone, limit } = queryKey[1];
  const response = await axios.get<BinanceKlines[]>(
    `${process.env.NEXT_PUBLIC_BINANCE_BASE_API}/api/v3/klines`,
    {
      params: {
        symbol,
        interval,
        startTime,
        endTime,
        timeZone,
        limit,
      },
    },
  );

  return response.data;
}
