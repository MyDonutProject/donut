import { FieldPath, FieldValues } from 'react-hook-form';
import { Order, TableGridProps } from '../props';

export interface TableGridContentProps<T extends FieldValues>
  extends TableGridProps<T> {
  order: Order;
  orderBy: FieldPath<T> | null;
}
