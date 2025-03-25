import { LottiePlayer } from 'lottie-web';
import { RefObject } from 'react';

export interface UseLottiePlayerProps<T> {
  path: string;
  loop?: boolean;
  autoplay?: boolean;
  dependecyArray?: T[];
  initialSegment?: [number, number];
}

export interface UseLottiePlayerReturn {
  lottieAnimationRef: RefObject<HTMLDivElement>;
  lottie: LottiePlayer | null;
}
