import { BinanceQueryKeys } from '../../enums';

export type FetchBinanceKlinesInputDto = {
  symbol: string;
  interval: string;
  startTime: number;
  endTime: number;
  timeZone: string;
  limit: number;
};

export type UseBinanceKlinesQueryKeyProps = [
  BinanceQueryKeys.Klines,
  FetchBinanceKlinesInputDto,
];

export type BinanceKlines = [
  number, // Kline open time
  string, // Open price
  string, // High price
  string, // Low price
  string, // Close price
  string, // Volume
  number, // Kline Close time
  string, // Quote asset volume
  number, // Number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string, // Unused field, ignore.
];
