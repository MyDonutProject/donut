import { Transition, Variants } from 'framer-motion';

const transition: Transition = {
  duration: 0.5,
  ease: 'easeInOut',
};

export const tableRowVariants: Variants = {
  show: {
    y: 0,
    opacity: 1,
    zIndex: 0,
    transition,
  },
  hidden: {
    y: -50,
    zIndex: -1,
    opacity: 0,
    transition,
  },
};

export const containerVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};
