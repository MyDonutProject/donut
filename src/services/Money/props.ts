import { Coin } from '@/models/coin';
import { CurrencyOptions } from '../WalletService/props';

export interface CreateMoneyPayload {
  amount: number;
  coin?: CurrencyOptions | Coin;
}
