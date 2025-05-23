import { BinanceQueryKeys } from '../../enums';

export type FetchBinanceTickerInputDto = {
  symbol: string;
};

export type UseBinanceTickerQueryKeyProps = [
  BinanceQueryKeys.Ticker,
  FetchBinanceTickerInputDto,
];

export type BinanceTicker = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
};
