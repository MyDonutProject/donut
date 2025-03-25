import { Coin } from '@/models/coin';
import { CreateMoneyPayload } from './props';
import { usdFormatting } from '@/constants/usdFormatting';
import { CoinID } from '@/models/coin/id';
import { MoneyFormatter } from '../MoneyFormatter';
import { CoinMetadata } from '../MoneyFormatter/interfaces';
import { coinsMetadataMapping } from '../MoneyFormatter/metadata';
import { Either } from '@/interfaces/either';
import { CoinType } from '@/models/coin/type';
import { CurrencyOptions } from '../WalletService/props';
import { Nullable } from '@/interfaces/nullable';
import { parseToBigInt } from '@/utils/bigint';

export class Money extends MoneyFormatter {
  private readonly units: number;
  private readonly locale: Either<string, undefined>;
  private readonly symbol: Either<string, undefined>;
  private readonly code: Either<string, undefined>;
  private readonly type: CoinType;
  private readonly scaleFactor: number;
  private readonly highScaleFactor: number;
  private _amount: number;
  private metadata: CoinMetadata;

  constructor(createMoneyPayload: CreateMoneyPayload) {
    super();
    const coin: Coin | CurrencyOptions =
      createMoneyPayload?.coin ?? usdFormatting;

    this.metadata = coinsMetadataMapping.get(
      !!(coin as Coin)?.id
        ? (coin as Coin)?.id.toString()
        : CoinID.USD.toString(),
    );

    this.code = coin.code;
    this.symbol = coin.symbol;
    this.locale = coin.locale;
    this.type = coin.decimals > 2 ? CoinType.Crypto : CoinType.Fiat;
    this.units = coin.decimals;

    this.scaleFactor = Math.pow(10, this.units);
    this.highScaleFactor = Math.pow(10, this.units * 2);

    this._amount = Number(
      this.fromSubunits(
        Money.toSubunits(
          String(createMoneyPayload.amount ?? 0),
          this.metadata,
          false,
        ),
        this.metadata,
      ),
    );
  }

  get amount(): number {
    return this._amount;
  }

  set amount(value: number) {
    this._amount = Number(
      this.fromSubunits(
        Money.toSubunits(String(value), this.metadata, false),
        this.metadata,
      ),
    );
  }

  get amountInSmallestUnit(): bigint {
    return Money.toSubunits(String(this._amount), this.metadata, false);
  }

  get maskedAmount(): Nullable<string> {
    if (!this?.locale) {
      return null;
    }

    if (this.type === CoinType.Fiat) {
      return new Intl.NumberFormat(this.locale, {
        style: 'currency',
        currency: this.code,
        currencyDisplay: 'symbol',
        minimumFractionDigits: this.units,
        maximumFractionDigits: this.units,
      })
        .format(this._amount)
        .replace(/\s/g, '');
    }

    return (
      new Intl.NumberFormat(this.locale, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: this.units,
      }).format(this._amount) + ` ${this.symbol}`
    );
  }

  get formattedAmount(): Nullable<string> {
    if (!this?.locale) {
      return null;
    }

    const fixedAmount = this._amount.toFixed(this.units);
    if (this.type === CoinType.Fiat) {
      return new Intl.NumberFormat(this.locale, {
        style: 'currency',
        currency: this.code,
        currencyDisplay: 'code',
        minimumFractionDigits: this.units,
        maximumFractionDigits: this.units,
      })
        .format(Number(fixedAmount))
        .replace(this.code ?? '', '')
        .replace(/\s/g, '');
    }

    return new Intl.NumberFormat(this.locale, {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: this.units,
    }).format(Number(fixedAmount));
  }

  public add(value: number): void {
    this._amount = Number(
      this.fromSubunits(
        this.amountInSmallestUnit +
          Money.toSubunits(String(value), this.metadata, false),
        this.metadata,
      ),
    );
  }

  public sub(value: number): void {
    this._amount = Number(
      this.fromSubunits(
        this.amountInSmallestUnit -
          Money.toSubunits(String(value), this.metadata, false),
        this.metadata,
      ),
    );
  }

  public multiply(value: number, multiplier: number): number {
    const scaledMultiplier: bigint = parseToBigInt(
      Math.floor(multiplier * (this.highScaleFactor ?? 1)),
    ) as bigint;
    const amountInSubUnits: bigint = Money.toSubunits(
      String(value),
      this.metadata,
      false,
    );

    return Number(
      this.fromSubunits(
        (amountInSubUnits * scaledMultiplier) /
          (parseToBigInt(this.highScaleFactor ?? 1) as bigint),
        this.metadata,
      ),
    );
  }

  public divide(value: number, divisor: number): number {
    const scaledDivisor: bigint = parseToBigInt(
      Math.floor(divisor * (this.scaleFactor ?? 1)),
    ) as bigint;
    const amountInSubUnits: bigint = Money.toSubunits(
      String(value),
      this.metadata,
      false,
    );
    return Number(
      this.fromSubunits(
        (amountInSubUnits * (parseToBigInt(this.scaleFactor ?? 1) as bigint)) /
          scaledDivisor,
        this.metadata,
      ),
    );
  }
}
