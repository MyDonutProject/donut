import { Coin } from '@/models/coin';
import { MoneyFormatOptions, Numeric } from '../interfaces';

export interface MoneyFormatterFormatProps {
  amount: Numeric;
  coin?: Coin;
  options?: Partial<MoneyFormatOptions>;
}
