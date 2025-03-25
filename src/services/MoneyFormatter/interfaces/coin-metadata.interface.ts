import { CoinSymbolPosition } from "../enums";

export interface CoinMetadata {
  decimalSeparator: string;
  thousandSeparator: string;
  decimalPlaces: number;
  symbol: string;
  symbolPosition: CoinSymbolPosition;
}
