/* eslint-disable react/no-danger */
import { SelectInputWithImageProps } from './props';
import styles from './styles.module.scss';
import { Image } from '@/components/core/Image';
/**
 * SelectInputWithImage Component
 * A customizable select input component that displays an image alongside text content.
 * Supports optional pair images, disabled states, and various visual customizations.
 *
 * @component
 * @param {Object} props - Component props
 * @param {() => void} props.handleOpen - Callback function when input is clicked
 * @param {boolean} props.open - Whether the select dropdown is open
 * @param {boolean} props.cardBg - Whether to use card background styling
 * @param {boolean} props.isWithoutChevron - Whether to hide the chevron icon
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {string} props.image - URL of the main image to display
 * @param {string} props.label - HTML content to display as label
 * @param {boolean} props.isSmall - Whether to use small size variant
 * @param {string} props.pairImage - URL of optional secondary paired image
 * @param {string} props.className - Additional CSS class names
 * @returns {JSX.Element} The rendered select input with image component
 *
 * @example
 * <SelectInputWithImage
 *   handleOpen={() => setIsOpen(true)}
 *   open={isOpen}
 *   cardBg={true}
 *   isWithoutChevron={false}
 *   disabled={false}
 *   image="https://example.com/coin.png"
 *   label="Bitcoin <span>(BTC)</span>"
 *   isSmall={false}
 *   pairImage="https://example.com/eth.png"
 *   className="custom-select"
 * />
 */
export function SelectInputWithImage({
  handleOpen,
  open,
  cardBg,
  isWithoutChevron,
  disabled,
  image,
  label,
  isSmall,
  pairImage,
  className,
}: SelectInputWithImageProps) {
  /**
   * Handles click events on the input
   * Only triggers handleOpen if input is not disabled
   */
  function handleClick() {
    if (disabled) {
      return;
    }

    handleOpen();
  }

  return (
    <div
      className={`${styles.input} ${cardBg ? styles['input--card-bg'] : ''} ${disabled ? styles['input--disabled'] : ''} ${isSmall ? styles['input--small'] : ''} ${className ? className : ''}`}
      onClick={handleClick}
    >
      <div className={styles.input__wrapper}>
        {image && label && (
          <div className={styles.input__image__wrapper}>
            <Image
              width={32}
              height={32}
              src={image}
              alt="coin-image"
              className={styles.input__image}
            />
            {pairImage && label && (
              <Image
                width={32}
                height={32}
                src={pairImage}
                alt="coin-image"
                className={styles.input__pair}
              />
            )}
          </div>
        )}
        <p dangerouslySetInnerHTML={{ __html: label }} />
        {!isWithoutChevron && !disabled && (
          <i
            className={`${styles.input__icon} ${open ? styles['input__icon--open'] : ''} fas fa-chevron-down`}
          />
        )}
        {disabled && <i className={`${styles.input__icon} fa-solid fa-lock`} />}
      </div>
    </div>
  );
}
