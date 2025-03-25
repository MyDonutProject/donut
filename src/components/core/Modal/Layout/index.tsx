import styles from './styles.module.scss';
import { PropsWithChildren, Ref } from 'react';
import { ModalLayoutProps } from './props';
import { Modal } from '..';
import { ModalHeader } from '../Header';
import { motion } from 'framer-motion';
import { containerVariants } from '../variants';
import useClickOutside from '@/hooks/useClickOutside';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useModal } from '@/hooks/modal/useModal';
import { drawerVariants } from './variants';
import { ModalsKey } from '@/enums/modalsKey';

/**
 * ModalLayout Component
 * A reusable modal layout component that provides a consistent structure for modals
 * with a header and content area. Handles modal visibility, closing behavior and styling.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The title text to display in the modal header
 * @param {string} props.modal - Modal identifier used by useModal hook
 * @param {boolean} [props.condition=true] - Additional condition to control modal visibility
 * @param {ReactNode} props.children - Content to render inside the modal
 * @param {boolean} [props.isLoading] - Whether to show loading state in header
 * @param {boolean} [props.smallMobilePadding] - Whether to use smaller padding on mobile
 * @param {boolean} [props.fitContent] - Whether modal should fit content size
 * @param {boolean} [props.clearParams=true] - Whether to clear URL params on close
 * @param {string} [props.className] - Additional CSS class names
 * @param {boolean} [props.smallHeaderPadding] - Whether to use smaller header padding
 * @returns {JSX.Element} The rendered modal with header and content
 *
 * @example
 * // Basic usage
 * <ModalLayout
 *   title="My Modal"
 *   modal="my-modal"
 *   isLoading={false}
 *   smallMobilePadding={true}
 *   fitContent={false}
 *   clearParams={true}
 *   className="custom-modal"
 *   smallHeaderPadding={false}
 * >
 *   <div>Modal content goes here</div>
 * </ModalLayout>
 */
export function ModalLayout({
  title,
  modal,
  condition = true,
  children,
  isLoading,
  smallMobilePadding,
  fitContent,
  clearParams = true,
  className,
  smallHeaderPadding,
  version,
  color,
  noPadding,
}: PropsWithChildren<ModalLayoutProps>) {
  const { handleContainer, isOpen, onClose } = useModal(modal as unknown as ModalsKey);
  const isMobile: boolean = useIsMobile();
  const ref = useClickOutside({
    open: isOpen,
    onClickOutside: handleClose,
  });

  /**
   * Handles closing the modal
   * Calls onClose with clearParams flag
   */
  function handleClose() {
    onClose(clearParams);
  }

  return (
    <Modal open={isOpen && condition} onClose={handleClose} version={version}>
      <motion.div
        className={`${styles.container} ${fitContent ? styles['container--fit-content'] : ''} ${smallMobilePadding ? styles['container--small-mobile-padding'] : ''} ${className ? className : ''} ${!!color ? styles['container--color'] : ''} `}
        style={{
          //@ts-ignore
          '--color': color,
        }}
        ref={isMobile ? (ref as unknown as Ref<HTMLDivElement>) : null}
        variants={isMobile ? drawerVariants : containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleContainer}
      >
        <ModalHeader
          title={title}
          onClose={handleClose}
          isLoading={isLoading}
          smallMobilePadding={smallMobilePadding}
          smallPadding={smallHeaderPadding}
          version={version}
        />
        <div
          className={`${styles.content} ${noPadding ? styles['content--no-padding'] : ''}`}
        >
          {children}
        </div>
      </motion.div>
    </Modal>
  );
}
