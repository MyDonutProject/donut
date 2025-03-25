import { FieldValues } from 'react-hook-form';
import { TableGridProps } from '../../props';

export interface TableGridRowProps<T extends FieldValues>
  extends Omit<TableGridProps<T>, 'rows'> {
  row: T;
  index: number;
}
