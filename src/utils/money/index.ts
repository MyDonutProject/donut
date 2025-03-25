import { Coin } from '@/models/coin';
import { Decimal } from '@/lib/Decimal';

export function getMoneyOrAmount(data: Decimal   | number | string | any) {
  if (data?.type === 'decimal') {
    return Decimal.fromSubunits(data.value ?? 0, {
      scale: data.scale,
    }).toNumber();
  }

  if (data instanceof Decimal) {
    return data.toNumber();
  }

  if (!!data && typeof data == 'object' && 'amount' in data) {
    return data?.amount ?? 0;
  }

  return data;
}

export function parseToSubunits(
  data: Decimal | number | bigint | string,
  coin?: Coin,
) {
  if (data instanceof Decimal) {
    return data.subunits;
  }

  if (coin) {
    return new Decimal(data?.toString() ?? 0, {
      scale: coin?.decimals,
    }).subunits;
  }

  return new Decimal(data?.toString() ?? 0, { scale: 2 })?.subunits;
}
