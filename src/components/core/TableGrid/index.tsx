import { useCallback, useState } from 'react';
import EnhancedTableHead from './Head';
import { Order, TableGridProps } from './props';
import TableGridContent from './Content';
import { FieldPath, FieldValues } from 'react-hook-form';
import styles from './styles.module.scss';

/**
 * TableGrid Component
 * A customizable data grid/table component that supports sorting, loading states, custom styling,
 * auto-scrolling animations, and row grouping.
 *
 * @component
 * @template T - Type extending FieldValues for row data structure
 * @param {Object} props - Component props
 * @param {T[]} props.rows - Array of data rows to display
 * @param {Array} props.columns - Column definitions for the table
 * @param {boolean} [props.useLargerRows] - Whether to use larger row heights
 * @param {boolean} [props.isLoading] - Whether table is in loading state
 * @param {boolean} [props.isSecondaryStyles] - Whether to use secondary styling
 * @param {boolean} [props.useAutoScroll=false] - Enable auto-scrolling animation
 * @param {boolean} [props.preventOrder] - Disable column sorting
 * @param {Function} [props.handleRedirect] - Callback for row click/redirect
 * @param {Function} [props.customGroupBy] - Custom function for row grouping
 * @returns {JSX.Element} The rendered table grid component
 *
 * @example
 * interface UserData extends FieldValues {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * const columns = [
 *   { id: 'name', label: 'Name' },
 *   { id: 'email', label: 'Email' }
 * ];
 *
 * const rows: UserData[] = [
 *   { id: 1, name: 'John Doe', email: 'john@example.com' },
 *   { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
 * ];
 *
 * <TableGrid
 *   rows={rows}
 *   columns={columns}
 *   useLargerRows={false}
 *   isLoading={false}
 *   isSecondaryStyles={true}
 *   useAutoScroll={true}
 *   handleRedirect={(row) => function('Clicked row:', row)}
 * />
 */
export function TableGrid<T extends FieldValues>({
  rows,
  columns,
  useLargerRows,
  isLoading,
  isSecondaryStyles,
  useAutoScroll = false,
  preventOrder,
  handleRedirect,
  customGroupBy,
}: TableGridProps<T>) {
  const [order, setOrder] = useState<Order>(Order.ASC);
  const [orderBy, setOrderBy] = useState<FieldPath<T> | null>(null);

  /**
   * Handles column sort requests
   * Updates sort order and column when a sortable column header is clicked
   *
   * @param {Order} order - The requested sort order (ASC/DESC)
   * @param {FieldPath<T>} property - The column property to sort by
   */
  const handleRequestSort = useCallback(
    (order: Order, property: FieldPath<T>) => {
      if (preventOrder) {
        return;
      }

      const isAsc = orderBy === property && order === Order.ASC;
      setOrder(isAsc ? Order.DESC : Order.ASC);
      setOrderBy(property);
    },
    [orderBy, preventOrder],
  );

  return (
    <div className={styles.container}>
      <div
        className={`${styles['container__table-container']} ${rows.length > 0 && isSecondaryStyles ? styles['container__table-container--secondary'] : ''}`}
      >
        <table
          className={`${styles['container__table-container__table']}`}
        >
          <EnhancedTableHead
            columns={columns}
            handleOrder={handleRequestSort}
            order={order}
            isSecondaryStyles={isSecondaryStyles}
            orderBy={orderBy}
            preventOrder={preventOrder}
          />
          <tbody
            style={{
              //@ts-ignore
              '--duration': `${rows.length}s`,
            }}
            className={`${styles['container__table-container__body']} ${rows.length > 0 && isSecondaryStyles ? styles['container__table-container__body--secondary'] : ''}`}
          >
            <TableGridContent
              columns={columns}
              order={order}
              useLargerRows={useLargerRows}
              orderBy={orderBy}
              rows={rows}
              isLoading={isLoading}
              isSecondaryStyles={isSecondaryStyles}
              handleRedirect={handleRedirect}
              customGroupBy={customGroupBy}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
