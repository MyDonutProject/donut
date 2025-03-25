import CoinCell from '@/components/pages/Rewards/Table/Cells/CoinCell';
import { CookiesKey } from '@/enums/cookiesKey';
import { Nullable } from '@/interfaces/nullable';
import { Decimal } from '@/lib/Decimal';
import { getCookie } from 'cookies-next';
import { JSX } from 'react';

export interface TableGridColumn<T extends any> {
  headerName: string;
  field: string;
  renderCell?(row: T): Nullable<JSX.Element>;
  renderHeaderCell?(rows: T[]): Nullable<JSX.Element>;
  valueFormatter?(row: T): string | number;
  renderRow?(row: T): JSX.Element;
  stickyColumn?: boolean;
}


export const rewardColumns: TableGridColumn<{
  symbol: string;
  amount: number;
  createdAt: Date;
}>[] = [
  {
    field: 'symbol',
    headerName: 'coin',
    renderCell: row => <CoinCell symbol={row.symbol} />,
  },
  {
    field: 'amount',
    headerName: 'amount',
    valueFormatter: row =>
      new Decimal(row?.amount?.toString(), {
        scale: row?.symbol === 'sol' ? 8 : 2,
      }).toNumberString(),
  },
  {
    field: 'createdAt',
    headerName: 'createdAt',
    renderCell: row => {
      return (
        <div>
          {row.createdAt.toLocaleDateString(
            getCookie(CookiesKey.Lang) as string,
          )}
        </div>
      );
    },
  },
];
