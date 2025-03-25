import { IconButtonProps } from './props';
import styles from './styles.module.scss';

/**
 * IconButton Component
 * A customizable button component that displays an icon with optional loading state
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler function
 * @param {ReactNode} props.children - Child elements to render inside button
 * @param {string} [props.id] - Button ID, defaults to 'icon-button'
 * @param {boolean} [props.disabled] - Whether button is disabled
 * @param {boolean} [props.isLoading] - Whether to show loading skeleton state
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.iconOnly] - Whether button only contains an icon
 * @param {boolean} [props.small] - Whether to use small button styling
 * @param {boolean} [props.isContainerColor] - Whether to use container background color
 * @returns {JSX.Element} Icon button or loading skeleton
 */
export function IconButton({
  onClick,
  children,
  id,
  disabled,
  isLoading,
  className,
  iconOnly,
  small,
  isContainerColor,
  border,
}: IconButtonProps) {
  if (isLoading) {
    return <div className={styles.skeleton} />;
  }

  return (
    <button
      type="button"
      id={id ?? 'icon-button'}
      className={`${styles.icon} ${className ? className : ''} ${iconOnly ? styles['icon--icon-only'] : ''} ${small ? styles['icon--small'] : ''} ${isContainerColor ? styles['icon--container'] : ''} ${border ? styles['icon--border'] : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
