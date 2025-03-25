import { TableGridContentProps } from './props';
import { useMemo } from 'react';
import { stableSort } from '../helpers';
import { FieldValues } from 'react-hook-form';
import styles from '../styles.module.scss';
import { TableCell } from '@mui/material';
import TableGridRow from './Row';
import TableGridRowSkeleton from './Row/Skeleton';
import { NoDataComponent } from '../../NoDataComponent';

/**
 * TableGridContent Component
 * Renders the content/body section of a data grid table, handling sorting, loading states,
 * empty states, and row rendering with optional grouping.
 *
 * @component
 * @template T - Type extending FieldValues for row data structure
 * @param {Object} props - Component props
 * @param {Array} props.columns - Column definitions for the table
 * @param {T[]} props.rows - Array of data rows to display
 * @param {boolean} props.isLoading - Whether table is in loading state
 * @param {Order} props.order - Current sort order ('asc' or 'desc')
 * @param {string} props.orderBy - Field currently being sorted by
 * @param {boolean} props.useLargerRows - Whether to use larger row heights
 * @param {boolean} props.isSecondaryStyles - Whether to use secondary styling
 * @param {Function} props.handleRedirect - Callback for row click/redirect
 * @param {Function} props.customGroupBy - Custom function for row grouping
 * @returns {JSX.Element} The rendered table content
 *
 * @example
 * interface UserData extends FieldValues {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * const columns = [
 *   { field: 'name', headerName: 'Name' },
 *   { field: 'email', headerName: 'Email' }
 * ];
 *
 * const rows: UserData[] = [
 *   { id: 1, name: 'John', email: 'john@example.com' },
 *   { id: 2, name: 'Jane', email: 'jane@example.com' }
 * ];
 *
 * <TableGridContent<UserData>
 *   columns={columns}
 *   rows={rows}
 *   isLoading={false}
 *   order="asc"
 *   orderBy="name"
 *   useLargerRows={false}
 *   isSecondaryStyles={false}
 *   handleRedirect={(row) => function('Clicked:', row)}
 *   customGroupBy={(row) => row.name[0]}
 * />
 */
export default function TableGridContent<T extends FieldValues>({
  columns,
  rows,
  isLoading,
  order,
  orderBy,
  useLargerRows,
  isSecondaryStyles,
  handleRedirect,
  customGroupBy,
}: TableGridContentProps<T>) {
  // Memoized rows with sorting applied
  const Rows = useMemo(
    () =>
      stableSort(rows, order, orderBy)?.map((row, index) => (
        <TableGridRow
          row={row}
          index={index}
          columns={columns}
          customGroupBy={customGroupBy}
          useLargerRows={useLargerRows}
          isLoading={isLoading}
          handleRedirect={handleRedirect}
          isSecondaryStyles={isSecondaryStyles}
          key={`table-grid-row-${row?.id ? row?.id : index}`}
        />
      )),
    [
      rows,
      order,
      orderBy,
      customGroupBy,
      columns,
      isSecondaryStyles,
      handleRedirect,
      isLoading,
      useLargerRows,
    ],
  );

  // Memoized loading skeleton rows
  const Skeletons = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, index) => (
        <TableGridRowSkeleton
          index={index}
          columns={columns}
          isSecondaryStyles={isSecondaryStyles}
          key={`table-grid-row-skeleton-${index}`}
        />
      )),
    [isSecondaryStyles, columns],
  );

  // Show empty state if no rows and not loading
  if (rows?.length == 0 && !isLoading) {
    return (
      <tr className={styles['container__table-container__body__row']}>
        <TableCell
          className={styles['container__table-container__body__row__mui-cell']}
          colSpan={columns.length}
        >
          <NoDataComponent tableStyles isSecondaryStyles isSmall />
        </TableCell>
      </tr>
    );
  }

  // Return loading skeletons, duplicated rows for secondary style, or normal rows
  return isLoading ? (
    Skeletons
  ) : isSecondaryStyles ? (
    <>
      {Rows}
      {Rows}
    </>
  ) : (
    Rows
  );
}
