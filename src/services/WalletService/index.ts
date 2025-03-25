import { usdFormatting } from '@/constants/usdFormatting';
import {
  ConvertValueToCoinOptions,
  MaskCurrencyMaskOptions,
  UnmaskCurrencyOptions,
} from './props';
import { getMoneyOrAmount } from '@/utils/money';
import { Money } from '../Money';

export class WalletService {
  static convertValueToCoin({
    value,
    valueCoinPrice,
    conversionCoinPrice,
  }: ConvertValueToCoinOptions) {
    const balanceInUSD: number = value * valueCoinPrice;
    return balanceInUSD / (conversionCoinPrice || 1);
  }

  static maskCurrency({
    amount,
    coin = usdFormatting,
    hideSymbol,
  }: MaskCurrencyMaskOptions): string {
    const money: Money = new Money({
      amount: getMoneyOrAmount(amount ?? 0),
      coin,
    });

    return hideSymbol
      ? (money.formattedAmount as string)
      : (money.maskedAmount as string);
  }

  static unmaskCurrency({
    amount,
    coin = usdFormatting,
  }: UnmaskCurrencyOptions): number {
    if (!amount) {
      return 0;
    }

    const locale = coin.locale || 'en-US';
    const symbol = coin.symbol || '';
    const decimalSeparator = (1.1).toLocaleString(locale).substring(1, 2);
    const groupingSeparator = (1000).toLocaleString(locale).substring(1, 2);

    let numericalValue = amount
      .replace(new RegExp(`\\s?${symbol}\\s?`, 'g'), '')
      .replace(new RegExp(`\\${groupingSeparator}`, 'g'), '')
      .replace(/\s+/g, '')
      .trim();

    if (decimalSeparator !== '.') {
      numericalValue = numericalValue.replace(decimalSeparator, '.');
    }

    const parsedNumber: number = parseFloat(numericalValue);

    return isNaN(parsedNumber) ? 0 : parsedNumber;
  }
}
