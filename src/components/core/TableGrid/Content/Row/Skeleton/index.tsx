import { FieldValues } from 'react-hook-form';
import styles from '../../../styles.module.scss';
import { TableGridRowSkeletonProps } from './props';

export default function TableGridRowSkeleton<T extends FieldValues>({
  columns,
  index,
  isSecondaryStyles,
}: TableGridRowSkeletonProps<T>) {
  return (
    <tr
      className={`${styles['container__table-container__body__row']} ${index % 2 != 0 ? styles['container__table-container__body__row--odd'] : ''} ${isSecondaryStyles ? styles['container__table-container__body__row--secondary'] : ''}`}
      key={`skeleton-row-${index}`}
    >
      {columns.map((column, index) => (
        <td
          className={`${styles['container__table-container__cell']} ${column?.alignEnd ? styles['container__table-container__cell--align-end'] : ''} ${column?.alignCenter ? styles['container__table-container__cell--align-center'] : ''}`}
          key={`row-cell-${index}-${index}`}
        >
          <div
            className={
              index % 2 != 0 ? styles['skeleton--odd'] : styles.skeleton
            }
          />
        </td>
      ))}
    </tr>
  );
}
