import { Decimal } from "@/lib/Decimal";
import { Coin } from "@/models/coin";

export class CurrencyOptions {
  symbol: string;
  code: string;
  locale: string;
  decimals: number;
}


export interface UnmaskCurrencyOptions {
  amount: string;
  coin?: Coin | CurrencyOptions;
}

export interface ConvertValueToCoinOptions {
  value: number;
  valueCoinPrice: number;
  conversionCoinPrice: number;
}

export interface MaskCurrencyMaskOptions {
  amount: number | Decimal;
  coin?: Coin | CurrencyOptions;
  hideSymbol?: boolean;
}
