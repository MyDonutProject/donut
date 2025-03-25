import { MouseEvent, PropsWithChildren } from 'react';
import { PageDrawerProps } from './props';
import styles from './styles.module.scss';
import { AnimatePresence, motion as m } from 'framer-motion';
import { pageDrawerVariant } from './variants';
import useClickOutside from '@/hooks/useClickOutside';
import { ModalHeader } from '../Modal/Header';

/**
 * PageDrawer Component
 * A sliding drawer component that appears from the side of the page.
 * Includes animation, click outside handling, and optional padding control.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls visibility of the drawer
 * @param {() => void} props.onClose - Callback function when drawer should close
 * @param {ReactNode} props.children - Content to render inside the drawer
 * @param {string} props.title - Title displayed in the drawer header
 * @param {boolean} [props.paddingless] - Whether to remove padding from content area
 * @returns {JSX.Element|null} The rendered drawer or null when closed
 *
 * @example
 * // Basic usage
 * <PageDrawer
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   title="Settings"
 * >
 *   <div>Drawer content here</div>
 * </PageDrawer>
 *
 * // Without padding
 * <PageDrawer
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   title="Full Width Content"
 *   paddingless={true}
 * >
 *   <div>Content without padding</div>
 * </PageDrawer>
 */
export function PageDrawer({
  isOpen,
  onClose,
  children,
  title,
  paddingless,
  version,
}: PropsWithChildren<PageDrawerProps>) {
  // Hook to handle clicks outside the drawer
  const { current } = useClickOutside({
    onClickOutside: onClose,
    open: isOpen,
  });

  /**
   * Prevents click events from bubbling up to parent elements
   * Used to prevent drawer from closing when clicking inside
   *
   * @param {MouseEvent<HTMLDivElement>} event - The click event object
   */
  function handleContainer(event: MouseEvent<HTMLDivElement>): void {
    event.stopPropagation();
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className={styles.container__overlay} onClick={onClose}>
          <m.div
            variants={pageDrawerVariant}
            initial="hidden"
            animate="open"
            onClick={handleContainer}
            exit="hidden"
            className={styles.container}
            //@ts-ignore
            ref={current}
          >
            <ModalHeader
              onClose={onClose}
              title={title}
              withoutPadding
              version={version}
            />

            <div
              className={`${styles.container__content} ${paddingless ? styles['container__content--paddingless'] : ''}`}
            >
              {children}
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
