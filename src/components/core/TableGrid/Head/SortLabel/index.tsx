import { TableHeadSortLabelProps } from './props';
import styles from './styles.module.scss';

/**
 * TableHeadSortLabel Component
 * A component that renders a sortable table header cell with an optional sort direction indicator.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether this column is currently being sorted
 * @param {string} props.direction - Sort direction ('asc' or 'desc')
 * @param {() => void} props.onClick - Callback when header is clicked to sort
 * @param {ReactNode} props.children - Label content to display
 * @param {boolean} props.preventOrder - Whether to disable sorting
 * @returns {JSX.Element} The rendered sortable header cell
 *
 * @example
 * <TableHeadSortLabel
 *   active={true}
 *   direction="asc"
 *   onClick={() => handleSort('name')}
 *   preventOrder={false}
 * >
 *   Name
 * </TableHeadSortLabel>
 */
export default function TableHeadSortLabel({
  active,
  direction,
  onClick,
  children,
  preventOrder,
}: TableHeadSortLabelProps) {
  return (
    <div
      className={`${styles.cell} ${preventOrder ? styles['cell--disabled'] : ''}`}
      onClick={onClick}
    >
      {children}
      {active && (
        <div
          className={`${styles.cell__icon} ${styles[`cell__icon--${direction}`]}`}
        >
          <i className="fa-solid fa-arrow-up" />
        </div>
      )}
    </div>
  );
}
