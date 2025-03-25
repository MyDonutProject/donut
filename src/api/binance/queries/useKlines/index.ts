import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { GenericError } from '@/models/generic-error';
import { fetchBinanceKlines } from './service';
import { BinanceQueryKeys } from '../../enums';
import {
  UseBinanceKlinesQueryKeyProps,
  FetchBinanceKlinesInputDto,
  BinanceKlines,
} from './props';
import { useMemo } from 'react';
import { formatKlines } from './utils';

export function useBinanceKlines({
  symbol,
  interval,
  startTime,
  endTime,
  limit,
  timeZone,
}: FetchBinanceKlinesInputDto) {
  const queryKey: UseBinanceKlinesQueryKeyProps = [
    BinanceQueryKeys.Klines,
    { symbol, interval, startTime, endTime, limit, timeZone },
  ];

  const { data, isFetching, error, refetch, ...query } = useQuery<
    BinanceKlines[],
    AxiosError<GenericError>,
    BinanceKlines[],
    UseBinanceKlinesQueryKeyProps
  >({
    queryKey,
    refetchInterval: 5000,
    queryFn: fetchBinanceKlines,
  });

  const chartData = useMemo(() => {
    return formatKlines(data);
  }, [data]);

  return {
    data,
    isFetching,
    error,
    refetch,
    chartData,
    ...query,
  };
}
