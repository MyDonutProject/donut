import { SelectOptionWithImageProps } from './props';
import styles from './styles.module.scss';
import { Image } from '@/components/core/Image';
/**
 * SelectOptionWithImage Component
 * A selectable option component that displays an image alongside label and description text.
 * Supports selection state and click handling.
 *
 * @component
 * @template T - The type of the option value
 * @param {Object} props - Component props
 * @param {T} props.option - The option value/data
 * @param {boolean} props.selected - Whether this option is currently selected
 * @param {(option: T) => void} props.handleSelect - Callback when option is selected
 * @param {string} props.image - URL of the image to display
 * @param {string} props.description - Optional description text
 * @param {string} props.label - Main label text
 * @returns {JSX.Element} The rendered option component with image
 *
 * @example
 * type CoinOption = {
 *   id: string;
 *   symbol: string;
 * };
 *
 * <SelectOptionWithImage<CoinOption>
 *   option={{ id: "btc", symbol: "BTC" }}
 *   selected={false}
 *   handleSelect={(opt) => function(opt.symbol)}
 *   image="https://example.com/btc-icon.png"
 *   description="Bitcoin cryptocurrency"
 *   label="Bitcoin"
 * />
 */
export function SelectOptionWithImage<T>({
  option,
  selected,
  handleSelect,
  image,
  description,
  label,
}: SelectOptionWithImageProps<T>) {
  return (
    <div
      className={`${styles.container} ${selected ? styles['container--selected'] : ''}`}
      onClick={() => handleSelect(option)}
    >
      {label && image && (
        <Image
          width={24}
          height={24}
          src={image}
          alt={`option-icon-${label}`}
          className={styles.container__image}
        />
      )}
      <div className={styles.container__label}>
        {label}
        {description ? <p>{description}</p> : <div />}
      </div>
    </div>
  );
}
