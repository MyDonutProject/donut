import { BinanceTicker, UseBinanceTickerQueryKeyProps } from './props';
import { QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';

export async function fetchBinanceTicker({
  queryKey,
}: QueryFunctionContext<UseBinanceTickerQueryKeyProps>) {
  const { symbol } = queryKey[1];
  const response = await axios.get<BinanceTicker>(
    `${process.env.NEXT_PUBLIC_BINANCE_BASE_API}/api/v3/ticker/24hr`,
    {
      params: {
        symbol,
      },
    },
  );

  return response.data;
}
