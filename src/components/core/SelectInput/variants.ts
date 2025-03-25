import { Variants } from 'framer-motion';

export const dropIn: Variants = {
  hidden: {
    y: -30,
    opacity: 0,
    pointerEvents: 'none',
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.25,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
    pointerEvents: 'all',
  },
  exit: {
    y: -30,
    opacity: 0,
    transition: {
      duration: 0.25,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
    pointerEvents: 'none',
  },
};
