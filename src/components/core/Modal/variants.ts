import { Transition, Variants } from 'framer-motion';

const itemTransition: Transition = {
  ease: 'easeInOut',
  duration: 0.25,
};

export const overlayVariant: Variants = {
  hidden: {
    opacity: 0,
    transition: itemTransition,
  },
  visible: {
    opacity: 1,
    transition: itemTransition,
  },
  exit: {
    opacity: 0,
    transition: itemTransition,
  },
};

export const containerVariants: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
    transition: itemTransition,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: itemTransition,
  },

  exit: {
    y: '100%',
    opacity: 0,
    transition: itemTransition,
  },
};
