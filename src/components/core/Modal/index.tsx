import { ModalProps } from './props';
import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { overlayVariant } from './Layout/variants';
import { SettingLayoutComponentId } from '@/models/setting/layout/component';

/**
 * Modal Component
 * A reusable modal component that renders a modal overlay with content.
 * Handles visibility, backdrop clicks, and animations.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is visible
 * @param {ReactNode} props.children - Content to render inside the modal
 * @param {() => void} props.onClose - Callback function when modal is closed
 * @returns {JSX.Element|null} The rendered modal or null when closed
 *
 * @example
 * // Basic usage
 * <Modal
 *   open={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 * >
 *   <div>Modal content goes here</div>
 * </Modal>
 */
export function Modal({
  open,
  children,
  version,
  onClose,
}: PropsWithChildren<ModalProps>) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariant}
          className={`${styles.overlay} ${version === SettingLayoutComponentId.ModalV2?.toString() ? styles['overlay--v2'] : ''}`}
          onClick={onClose}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
