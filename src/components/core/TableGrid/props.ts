import { Nullable } from '@/interfaces/nullable';
import { JSX } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';

export interface TableGridColumn<T extends FieldValues> {
  headerName: string;
  field: FieldPath<T>;
  alignEnd?: boolean;
  alignCenter?: boolean;
  renderCell?(row: T, index: number): JSX.Element;
  renderHeaderCell?(): Nullable<JSX.Element>;
  valueFormatter?(row: T, index: number): string | number;
}

export interface TableGridProps<T extends FieldValues> {
  rows: T[];
  columns: TableGridColumn<T>[];
  isLoading?: boolean;
  isSecondaryStyles?: boolean;
  useLargerRows?: boolean;
  useAutoScroll?: boolean;
  preventOrder?: boolean;
  handleRedirect?(row: T): void;
  customGroupBy?(row: T): boolean;
}
export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export interface TableGridHeaderProps<T extends FieldValues>
  extends Omit<TableGridProps<T>, 'rows' | 'isLoading'> {
  order: Order;
  orderBy: FieldPath<T> | null;
  handleOrder(order: Order, orderBy: FieldPath<T>): void;
}
