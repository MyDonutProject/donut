import styles from './styles.module.scss';

/**
 * CloseButton Component
 * A reusable button component that renders a close/dismiss icon (X) button.
 * Extends the standard HTML button attributes and applies custom styling.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS class names to apply
 * @param {...React.ButtonHTMLAttributes<HTMLButtonElement>} props - All other button HTML attributes
 * @returns {JSX.Element} A styled button element with close icon
 *
 * @example
 * // Basic usage
 * <CloseButton onClick={() => function('close clicked')} />
 *
 * // With custom className
 * <CloseButton
 *   className="custom-close"
 *   onClick={() => function('close clicked')}
 *   aria-label="Close modal"
 * />
 */
export default function CloseButton({
  className,

  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${styles.button} ${className ? className : ''}`}
      {...props}
      type="button"
    >
      <i className="fa-solid fa-xmark" />
    </button>
  );
}
