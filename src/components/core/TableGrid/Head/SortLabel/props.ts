import { PropsWithChildren } from 'react';

export type TableHeadSortDirectionOptions = 'asc' | 'desc';

export interface TableHeadSortLabelProps extends PropsWithChildren {
  active: boolean;
  direction: TableHeadSortDirectionOptions;
  onClick: VoidFunction;
  preventOrder?: boolean;
}
