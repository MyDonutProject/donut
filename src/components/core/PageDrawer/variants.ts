import { Transition, Variants } from 'framer-motion';

export const drawerTransition: Transition = {
  duration: 0.3,
  ease: 'easeInOut',
};

export const pageDrawerVariant: Variants = {
  hidden: {
    x: 450,
    transition: drawerTransition,
  },
  open: {
    x: 0,
    transition: drawerTransition,
  },
};
