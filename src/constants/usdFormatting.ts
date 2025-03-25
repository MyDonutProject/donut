import { CoinType } from "@/models/coin/type";
import { CurrencyOptions } from "@/services/WalletService/props";

export const usdFormatting: CurrencyOptions = {
  symbol: '$',
  code: 'USD',
  decimals: 2,
  locale: 'en-US',
};
