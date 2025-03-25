import { CoinID } from '@/models/coin/id';
import { CoinSymbolPosition, TrailingZeroDisplay } from '../enums';
import { sanitizeNumberInput } from '../helpers';
import { CoinMetadata, Either, IMoneyFormatter } from '../interfaces';
import { coinsMetadataMapping } from '../metadata';
import { MoneyFormatterFormatProps } from './props';
import { Coin } from '@/models/coin';

export class MoneyFormatter implements IMoneyFormatter {
  /**
   * Formats a numeric value into a human-readable string with currency formatting.
   * @param amount - The numeric value to format (can be a string, number, or BigInt).
   * @param coin -The coin to format.
   * @param options - Optional formatting options like trailing zero display.
   * @returns A formatted string with the specified currency symbol and style.
   */
  public static format(props: MoneyFormatterFormatProps): string {
    const { amount, coin = {} as Coin, options = {} } = props ?? {};

    const metadata = coinsMetadataMapping.get(
      !!coin?.id ? coin?.id.toString() : CoinID.USD.toString(),
    );

    const {
      decimalSeparator,
      thousandSeparator,
      decimalPlaces,
      symbol,
      symbolPosition,
    } = metadata;

    // Convert the amount to a string and sanitize it
    const numericValue: string = sanitizeNumberInput(String(amount));

    // Split integer and decimal parts
    let [integerPart, decimalPart = '']: Array<string> =
      numericValue.split('.');

    // Handle negative numbers
    const isNegative: boolean = integerPart.startsWith('-');

    if (isNegative) {
      integerPart = integerPart.slice(1);
    }

    // Add thousand separators to the integer part
    integerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      thousandSeparator,
    );

    // Adjust the decimal part to match the required decimal places
    let adjustedDecimalPart: string = decimalPart
      .padEnd(decimalPlaces, '0')
      .slice(0, decimalPlaces);

    // Combine integer and decimal parts
    let formattedValue: string = integerPart;

    if (decimalPlaces > 0) {
      if (options?.trailingZeroDisplay === TrailingZeroDisplay.Strip) {
        adjustedDecimalPart = adjustedDecimalPart.replace(/0+$/, '');
      }

      if (adjustedDecimalPart.length > 0) {
        formattedValue += decimalSeparator + adjustedDecimalPart;
      }
    }

    // Re-add negative sign if necessary
    if (isNegative) {
      formattedValue = '-' + formattedValue;
    }

    // Add coin symbol based on its position
    return options?.hideSymbol === true
      ? formattedValue
      : symbolPosition === CoinSymbolPosition.Before
        ? `${symbol}${formattedValue}`
        : `${formattedValue} ${symbol}`;
  }

  /**
   * Removes formatting (e.g., separators and symbols) from a formatted monetary value.
   * @param formattedValue - The formatted monetary string to unformat.
   * @param metadata - Metadata containing formatting rules like separators and symbol.
   * @returns A sanitized numeric string representation without formatting.
   */
  public static unformat(
    formattedValue: string,
    metadata: CoinMetadata,
  ): string {
    const { decimalSeparator, thousandSeparator, symbol, symbolPosition } =
      metadata;

    // Escape coin symbol for use in regex
    const escapedCoinSymbol: string = symbol.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );

    // Remove coin symbol and any surrounding spaces
    let numericString: string = formattedValue;
    const symbolRegex: RegExp = new RegExp(
      symbolPosition === CoinSymbolPosition.Before
        ? `^\\s*${escapedCoinSymbol}\\s*`
        : `\\s*${escapedCoinSymbol}\\s*$`,
      'i',
    );
    numericString = numericString.replace(symbolRegex, '');

    // Remove thousand separators
    const thousandSeparatorRegex: RegExp = new RegExp(
      `\\${thousandSeparator}`,
      'g',
    );
    numericString = numericString.replace(thousandSeparatorRegex, '');

    // Replace decimal separator with dot
    const decimalSeparatorRegex: RegExp = new RegExp(
      `\\${decimalSeparator}`,
      'g',
    );
    numericString = numericString.replace(decimalSeparatorRegex, '.');

    // Trim any remaining spaces
    numericString = numericString.trim();

    // Handle negative numbers
    numericString = numericString.replace(/\s+/g, '');

    const isNegative: boolean = numericString.startsWith('-');

    if (isNegative) {
      numericString = '-' + numericString.slice(1);
    }

    return numericString;
  }

  /**
   * Converts a formatted number into its smallest unit representation (e.g., cents).
   * @param num - The formatted number as a string.
   * @param metadata - Metadata containing the currency's decimal places and formatting rules.
   * @param masked - Whether the input is already formatted (requires unformatting).
   * @returns A BigInt representing the value in subunits (e.g., cents).
   */
  public static toSubunits(
    num: string,
    metadata: CoinMetadata,
    masked?: boolean,
  ): bigint {
    if (!num || num === '') {
      //@ts-ignore
      return 0n;
    }

    let numberString: string =
      masked === true ? MoneyFormatter.unformat(num, metadata) : num;

    // Parse scientific notation numbers
    if (numberString.includes('e-')) {
      numberString = Number(numberString).toFixed(21); // Convert to fixed-point notation
    } else if (numberString.includes('e')) {
      // Parse scientific notation manually
      const [base, exponent]: Array<number> = numberString
        .split('e')
        .map(Number);
      numberString = (base * Math.pow(10, exponent)).toString();
    }

    const [integerPart, fractionalPart = '']: Array<string> =
      numberString.split('.');

    const { decimalPlaces } = metadata;

    // Ensure fractional part has the correct number of digits
    const adjustedFractionalPart: string = fractionalPart
      .padEnd(decimalPlaces, '0')
      .slice(0, decimalPlaces);

    // Combine integer and fractional parts
    const combined: string = integerPart + adjustedFractionalPart;

    return combined as unknown as bigint;
  }

  /**
   * Converts a subunit value (e.g., cents) back to its formatted string representation.
   * @param subunits - The value in subunits (e.g., cents) as a BigInt or string.
   * @param metadata - Metadata containing formatting rules like decimal places.
   * @returns A formatted string with the appropriate decimal and thousands separators.
   */
  public fromSubunits(
    subunits: Either<bigint, string>,
    metadata: CoinMetadata,
  ): string {
    const { decimalPlaces } = metadata;

    // Convert the BigInt to a string for manipulation
    let subunitString: string =
      typeof subunits === 'string' ? subunits : subunits.toString();

    // Handle cases where subunitString length is less than decimalPlaces
    if (subunitString.length <= decimalPlaces) {
      // Pad with leading zeros if necessary
      subunitString = subunitString.padStart(decimalPlaces + 1, '0');
    }

    // Split into integer and fractional parts
    const integerPart: string = subunitString.slice(0, -decimalPlaces) || '0';
    const fractionalPart: string = subunitString.slice(-decimalPlaces);

    // Combine integer and fractional parts with a decimal point
    const result: string = `${integerPart}.${fractionalPart}`;

    // Remove trailing zeros from the fractional part and any trailing dot
    return result.replace(/\.?0+$/, '');
  }
}
