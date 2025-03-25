import { SelectOptionWithHighlightProps } from './props';
import styles from './styles.module.scss';

/**
 * SelectOptionWithHighlight Component
 * A selectable option component that displays a label with highlighted description text.
 * Supports selection state and click handling.
 *
 * @component
 * @template T - The type of the option value
 * @param {Object} props - Component props
 * @param {T} props.option - The option value/data
 * @param {boolean} props.selected - Whether this option is currently selected
 * @param {(option: T) => void} props.handleSelect - Callback when option is selected
 * @param {string} props.description - Description text to display highlighted
 * @param {string} props.label - Main label text
 * @returns {JSX.Element} The rendered option component
 *
 * @example
 * type CoinOption = {
 *   id: string;
 *   symbol: string;
 * };
 *
 * <SelectOptionWithHighlight<CoinOption>
 *   option={{ id: "btc", symbol: "BTC" }}
 *   selected={false}
 *   handleSelect={(opt) => function(opt.symbol)}
 *   description="Bitcoin"
 *   label="BTC"
 * />
 */
export function SelectOptionWithHighlight<T>({
  option,
  selected,
  handleSelect,
  description,
  label,
}: SelectOptionWithHighlightProps<T>) {
  return (
    <div
      className={`${styles.container} ${selected ? styles['container--selected'] : ''}`}
      onClick={() => handleSelect(option)}
    >
      <p className={styles.container__label}>
        {label}
        <strong>{description}</strong>
      </p>
    </div>
  );
}
