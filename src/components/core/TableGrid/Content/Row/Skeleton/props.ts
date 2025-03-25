import { FieldValues } from 'react-hook-form';
import { TableGridProps } from '../../../props';

export interface TableGridRowSkeletonProps<T extends FieldValues>
  extends Pick<TableGridProps<T>, 'columns' | 'isSecondaryStyles'> {
  index: number;
}
