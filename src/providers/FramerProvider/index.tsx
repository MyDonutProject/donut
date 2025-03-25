import { LazyMotion, domAnimation } from 'framer-motion';
import { PropsWithChildren } from 'react';

export default function FramerProvider({ children }: PropsWithChildren) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
