import styles from '../../styles.module.scss';
import { TableGridRowProps } from './props';
import { FieldValues, get } from 'react-hook-form';
import { memo, useCallback } from 'react';
import { TableGridColumn } from '../../props';
import { preventRedirectColumns } from '../prevent-items';

/**
 * TableGridRow Component
 * Renders a single row in a data grid table with customizable cell rendering, formatting, and click handling.
 * Supports different styling variants and grouping functionality.
 *
 * @component
 * @template T - Type extending FieldValues for row data structure
 * @param {Object} props - Component props
 * @param {TableGridColumn<T>[]} props.columns - Array of column definitions
 * @param {T} props.row - Data object for this row
 * @param {number} props.index - Row index
 * @param {boolean} props.isSecondaryStyles - Whether to use secondary styling
 * @param {boolean} props.useLargerRows - Whether to use larger row heights
 * @param {(row: T) => void} props.handleRedirect - Callback for row click/redirect
 * @param {(row: T) => string} props.customGroupBy - Custom function for row grouping
 * @returns {JSX.Element} The rendered table row
 *
 * @example
 * interface UserData extends FieldValues {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * const columns: TableGridColumn<UserData>[] = [
 *   { field: 'name', headerName: 'Name' },
 *   { field: 'email', headerName: 'Email', alignEnd: true }
 * ];
 *
 * <TableGridRow<UserData>
 *   columns={columns}
 *   row={{ id: 1, name: 'John', email: 'john@example.com' }}
 *   index={0}
 *   isSecondaryStyles={false}
 *   useLargerRows={false}
 *   handleRedirect={(row) => function('Clicked:', row)}
 *   customGroupBy={(row) => row.name[0]}
 * />
 */
function TableGridRow<T extends FieldValues>({
  columns,
  row,
  index,
  isSecondaryStyles,
  useLargerRows,
  handleRedirect,
  customGroupBy,
}: TableGridRowProps<T>) {
  /**
   * Handles click events on table cells
   * Only triggers redirect if the column is not in preventRedirectColumns
   *
   * @param {T} row - The row data object
   * @param {TableGridColumn<T>} column - The column definition
   * @returns {void}
   */
  const handleOnClick = useCallback(
    (row: T, column: TableGridColumn<T>) => {
      if (
        handleRedirect &&
        !preventRedirectColumns.some(v => column.field == v) &&
        !preventRedirectColumns.some(v => column.headerName == v)
      ) {
        handleRedirect(row);
        return;
      }
    },
    [handleRedirect],
  );

  return (
    <tr
      className={`row ${styles['container__table-container__body__row']} ${customGroupBy != undefined ? customGroupBy(row) : index % 2 != 0 ? styles['container__table-container__body__row--odd'] : ''} ${row && isSecondaryStyles ? styles['container__table-container__body__row--secondary'] : ''} ${row && useLargerRows ? styles['container__table-container__body__row--larger'] : ''} ${handleRedirect ? styles['table-row--clickable'] : ''} `}
    >
      {columns.map((column, idx) => {
        if (column.renderCell) {
          return (
            <td
              onClick={() => handleOnClick(row, column)}
              className={`${styles['container__table-container__cell']} ${column?.alignEnd ? styles['container__table-container__cell--align-end'] : ''} ${column?.alignCenter ? styles['container__table-container__cell--align-center'] : ''}`}
              key={`table_cell_${get(row, column.field)}_${idx}`}
            >
              {column.renderCell(row, index)}
            </td>
          );
        }

        if (column.valueFormatter) {
          return (
            <td
              onClick={() => handleOnClick(row, column)}
              className={`${styles['container__table-container__cell']} ${column?.alignEnd ? styles['container__table-container__cell--align-end'] : ''} ${column?.alignCenter ? styles['container__table-container__cell--align-center'] : ''}`}
              key={`table_cell_${get(row, column.field)}_${idx}`}
            >
              {column.valueFormatter(row, index)}
            </td>
          );
        }

        return (
          <td
            onClick={() => handleOnClick(row, column)}
            className={`${styles['container__table-container__cell']} ${column?.alignEnd ? styles['container__table-container__cell--align-end'] : ''} ${column?.alignCenter ? styles['container__table-container__cell--align-center'] : ''}`}
            key={`table_cell_${get(row, column.field)}_${idx}`}
          >
            {get(row, column.field)}
          </td>
        );
      })}
    </tr>
  );
}

export default memo(TableGridRow) as typeof TableGridRow;
