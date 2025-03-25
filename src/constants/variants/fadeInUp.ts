import { Transition, Variants } from 'framer-motion';

const transition: Transition = { ease: 'linear', duration: 0.25 };

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
    transition,
  },
  show: {
    opacity: 1,
    y: 0,
    transition,
  },
};
