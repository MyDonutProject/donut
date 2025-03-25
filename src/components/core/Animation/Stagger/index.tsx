import { ForwardedRef, forwardRef, PropsWithChildren, ReactNode } from 'react';
import { StaggerAnimationProps } from './props';
import styles from './styles.module.scss';
import { CSSProperties } from 'react';

/**
 * Wraps children with stagger animation styles
 *
 * @param {Object} props - Component props
 * @param {number} props.stagger - Delay between each child animation in seconds
 * @param {string} props.staggerDirection - Direction of the stagger animation
 * @param {ReactNode} props.children - Child elements to animate
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.direction - Direction of the animation
 * @returns {ReactNode} Wrapped children with stagger animations
 */
function wrapWithAnimation({
  stagger,
  staggerDirection,
  children,
  className,
  direction,
}: PropsWithChildren<StaggerAnimationProps>): ReactNode {
  /**
   * Generates animation delay style based on index
   *
   * @param {number} idx - Index of the child element
   * @returns {CSSProperties} Style object with animation delay
   */
  function getAnimationStyle(idx: number): CSSProperties {
    return {
      animationDelay: `${idx * stagger}s`,
    };
  }

  if (Array.isArray(children)) {
    return children.map((child, idx) => {
      return (
        <div
          key={`stagger-children-${idx}`}
          className={`${styles[`container__children--stagger-${staggerDirection}`]} ${styles[`container__children--${direction}`]} ${className}`}
          style={getAnimationStyle(idx)}
        >
          {child}
        </div>
      );
    });
  }

  return (
    <div
      className={`${styles[`container__children--stagger-${staggerDirection}`]} ${styles[`container__children--${direction}`]} ${className}`}
      style={getAnimationStyle(0)}
    >
      {children}
    </div>
  );
}

/**
 * Stagger animation component that animates children with a delay between each
 *
 * @param {Object} props - Component props
 * @param {string} props.direction - Direction of the animation
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.staggerProps - Additional stagger animation props
 * @param {ForwardedRef<HTMLDivElement>} ref - Forwarded ref
 * @returns {JSX.Element} Container with staggered children animations
 */
//eslint-disable-next-line
export const StaggerAnimation = forwardRef(
  (
    {
      direction,
      className,
      ...staggerProps
    }: PropsWithChildren<StaggerAnimationProps>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles.container} ${styles[`container--${direction}`]} ${className}`}
      >
        {wrapWithAnimation({ direction, ...staggerProps })}
      </div>
    );
  },
);
