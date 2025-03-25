import { forwardRef, PropsWithChildren } from 'react';
import { ButtonProps } from './props';
import styles from './styles.module.scss';

/**
 * A customizable button component with various styling options and states
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} [props.visible=true] - Whether the button should be visible
 * @param {ReactNode} props.children - Child elements to render inside button
 * @param {boolean} [props.disabled] - Whether the button is disabled
 * @param {boolean} [props.isloading] - Whether to show loading spinner
 * @param {boolean} [props.isSecondary] - Use secondary button styling
 * @param {boolean} [props.isSmall] - Use small button size
 * @param {boolean} [props.isSkeleton] - Show skeleton loading state
 * @param {boolean} [props.isErrorButton] - Use error button styling
 * @param {boolean} [props.isTiny] - Use tiny button size
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.isLinkButton] - Style as a link
 * @param {boolean} [props.useMaxContent] - Allow button to grow to content width
 * @param {string} [props.icon] - Icon class name to display
 * @param {boolean} [props.skeletonDefault] - Use default skeleton styling
 * @param {CSSProperties} [props.style] - Additional inline styles
 * @param {boolean} [props.dotted] - Show dotted border
 * @param {boolean} [props.isTransparent] - Use transparent background
 * @param {React.Ref} ref - Forwarded ref to the button element
 * @returns {JSX.Element|null} Button component or null if not visible
 */
export const Button = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
>(
  (
    {
      visible = true,
      children,
      disabled,
      isloading,
      isSecondary,
      isSmall,
      isSkeleton,
      isErrorButton,
      isTiny,
      className = '',
      isLinkButton,
      useMaxContent,
      icon,
      skeletonDefault,
      style,
      dotted,
      isTransparent,
      ...props
    },
    ref,
  ) => {
    // Return null if button should not be visible
    if (!visible) {
      return null;
    }

    // Render skeleton loading state if isSkeleton is true
    if (isSkeleton) {
      return (
        <div
          className={`${skeletonDefault ? `${styles['button__skeleton-default']} ${isSmall ? styles['button__skeleton-default--isSmall'] : ''}` : `${styles.button__skeleton} ${isSmall ? styles['button__skeleton--isSmall'] : ''}`} ${className}`}
        />
      );
    }

    // Render main button with all styling variations
    return (
      <button
        {...props}
        ref={ref}
        className={`${styles.button} ${isSecondary ? styles['button--secondary'] : ''} ${isSmall ? styles['button--isSmall'] : ''} ${isTiny ? styles['button--isTiny'] : ''} ${isErrorButton ? styles['button--isErrorButton'] : ''} ${isLinkButton ? styles['button--isLinkButton'] : ''} ${useMaxContent ? styles['button--useMaxContent'] : ''} ${dotted ? styles['button--dotted'] : ''} ${isTransparent ? styles['button--transparent'] : ''} ${className ? className : ''}`}
        disabled={isloading || disabled}
        style={style}
      >
        {/* Render loading spinner or icon if specified */}
        {(icon || isloading) && (
          <i
            className={`${isloading ? `${styles.button__spinner} fas fa-circle-notch fa-spin` : ''} ${icon && !isloading ? icon : ''} `}
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
