import { AnimationItem, LottiePlayer } from 'lottie-web';
import { useEffect, useRef, useState } from 'react';
import { UseLottiePlayerProps, UseLottiePlayerReturn } from './props';

/**
 * Custom hook to manage Lottie animations.
 *
 * @template T - The type of the props.
 * @param {UseLottiePlayerProps<T>} props - The properties for the Lottie player hook.
 * @param {string} props.path - The path to the Lottie animation file.
 * @param {boolean} [props.autoplay=true] - Whether the animation should autoplay.
 * @param {boolean} [props.loop=true] - Whether the animation should loop.
 * @param {Array<any>} [props.dependecyArray=[]] - Additional dependencies for the effect hook.
 * @param {Array<number>} [props.initialSegment] - The initial segment of the animation to play.
 *
 * @returns {UseLottiePlayerReturn} - An object containing a ref for the animation container and the Lottie player instance.
 *
 * Example usage:
 * const { lottieAnimationRef, lottie } = useLottiePlayer({
 *   path: '/animations/sample.json',
 *   autoplay: true,
 *   loop: false,
 *   dependecyArray: [someDependency],
 *   initialSegment: [0, 100],
 * });
 */
export function useLottiePlayer<T>({
  path,
  autoplay = true,
  loop = true,
  dependecyArray = [],
  initialSegment,
}: UseLottiePlayerProps<T>): UseLottiePlayerReturn {
  // State to hold the Lottie player instance
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);
  // Ref to attach to the animation container
  const lottieAnimationRef = useRef(null);

  /**
   * Function to dynamically import and set the Lottie player.
   */
  const loadLottiePlayer = () => {
    import('lottie-web').then(Lottie => setLottie(Lottie.default));
  };

  // Effect to load the Lottie player when the component mounts
  useEffect(loadLottiePlayer, []);

  /**
   * Function to start the Lottie animation.
   * It initializes the animation with the provided settings.
   *
   * @returns {Function} - A cleanup function to destroy the animation when the component unmounts.
   */
  const startLottieAnimation = () => {
    if (lottie && lottieAnimationRef.current) {
      const animation: AnimationItem = lottie.loadAnimation({
        container: lottieAnimationRef!.current,
        renderer: 'svg',
        loop,
        autoplay,
        path: `${process.env.NEXT_PUBLIC_S3_BUCKET_BASE_URL}${process.env.NEXT_PUBLIC_LOTTIE_URL ?? '/lotties'}${path?.startsWith('/') ? path : `/${path}`}`,
        initialSegment,
      });

      return () => {
        animation.destroy();
      };
    }
  };

  // Effect to start the Lottie animation when dependencies change
  useEffect(startLottieAnimation, [
    lottie,
    autoplay,
    loop,
    path,
    ...dependecyArray,
  ]);

  // Return the ref for the animation container and the Lottie player instance
  return { lottieAnimationRef, lottie };
}

export type { UseLottiePlayerProps, UseLottiePlayerReturn };
