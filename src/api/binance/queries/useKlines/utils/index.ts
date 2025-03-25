import { AreaData, WhitespaceData } from 'lightweight-charts';
import { BinanceKlines } from '../props';
import { Decimal } from '@/lib/Decimal';

export function formatKlines(data: BinanceKlines[]) {
  const mapped =
    data?.map(kline => ({
      time: Math.floor(kline[0] / 1000),
      value: Decimal.fromSubunits(kline[4].replace('.', ''), {
        scale: 8,
      }).toNumber(),
    })) || ([] as (AreaData | WhitespaceData)[]);

  const sorted = mapped.sort((a, b) => {
    if (a.time < b.time) return -1;
    if (a.time > b.time) return 1;
    return 0;
  });

  return sorted;
}
