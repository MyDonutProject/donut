import { AnimationProps } from './props';
import { PropsWithChildren } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './styles.module.scss';

/**
 * Animation component that provides fade animations when elements come into view
 *
 * @param {AnimationProps} props - The component props
 * @param {AnimationVariantProps} props.type - The type of fade animation (fadeInLeft, fadeInRight, fadeInUp, fadeInDown)
 * @param {ReactNode} props.children - Child elements to animate
 * @param {boolean} props.triggerOnce - Whether animation should only trigger once (defaults to false)
 * @param {string} props.className - Additional CSS classes to apply
 * @returns {JSX.Element} Animated div containing children
 */
export function Animation({
  type,
  children,
  triggerOnce = false,
  className,
}: PropsWithChildren<AnimationProps>) {
  // Use intersection observer to detect when element comes into view
  const { inView, ref } = useInView({
    initialInView: true,
    triggerOnce,
  });

  return (
    <div
      ref={ref}
      key={`animation-${type}-${!inView}`}
      className={`${styles.container} ${inView ? styles[`container--${type}`] : ''} ${className}`}
    >
      {children}
    </div>
  );
}
