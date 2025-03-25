import { TableGridHeaderProps } from '../props';
import { FieldValues } from 'react-hook-form';
import styles from '../styles.module.scss';
import TableHeadSortLabel from './SortLabel';
import { useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';

/**
 * EnhancedTableHead Component
 * A customizable table header component that supports sorting, custom styling, and column alignment.
 *
 * @component
 * @template T - Type extending FieldValues for column data structure
 * @param {Object} props - Component props
 * @param {Array} props.columns - Column definitions for the table header
 * @param {Function} props.handleOrder - Callback for handling sort order changes
 * @param {string} props.order - Current sort order ('asc' or 'desc')
 * @param {string} props.orderBy - Field currently being sorted by
 * @param {boolean} props.isSecondaryStyles - Whether to use secondary styling
 * @param {boolean} props.preventOrder - Disable column sorting
 * @returns {JSX.Element} The rendered table header component
 *
 * @example
 * interface UserData extends FieldValues {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * const columns = [
 *   { field: 'name', headerName: 'Name', alignEnd: false },
 *   { field: 'email', headerName: 'Email', alignCenter: true }
 * ];
 *
 * <EnhancedTableHead<UserData>
 *   columns={columns}
 *   handleOrder={(order, field) => function('Sort by:', field, order)}
 *   order="asc"
 *   orderBy="name"
 *   isSecondaryStyles={false}
 *   preventOrder={false}
 * />
 */
function EnhancedTableHead<T extends FieldValues>({
  columns,
  handleOrder,
  order,
  orderBy,
  isSecondaryStyles,
  preventOrder,
}: TableGridHeaderProps<T>) {
  const { t } = useTranslation('data-grid');

  // Memoize columns to prevent unnecessary re-renders of table headers
  const Columns = useMemo(
    () =>
      columns.map((column, i) => (
        <td
          className={`${styles['container__table-container__cell']} ${styles['container__table-container__cell--head']} ${column?.alignEnd ? styles['container__table-container__cell--align-end'] : ''} ${column?.alignCenter ? styles['container__table-container__head--align-center'] : ''} ${preventOrder ? styles['container__table-container__cell--head--disabled'] : ''}`}
          key={`table_cell_head_${i}`}
        >
          {column?.renderHeaderCell ? (
            column?.renderHeaderCell()
          ) : (
            <TableHeadSortLabel
              active={orderBy == column.field}
              direction={orderBy === column.field ? order : 'asc'}
              onClick={() => handleOrder(order, column.field)}
            >
              {t(column.headerName)}
            </TableHeadSortLabel>
          )}
        </td>
      )),
    [columns, orderBy, order, preventOrder, t, handleOrder],
  );

  return (
    <thead>
      <tr
        className={`${styles['container__table-container__head']} ${isSecondaryStyles ? styles['container__table-container__head--secondary'] : ''}`}
      >
        {Columns}
      </tr>
    </thead>
  );
}

export default EnhancedTableHead;
