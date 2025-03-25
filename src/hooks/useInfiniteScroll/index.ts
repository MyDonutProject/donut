import { useCallback, useEffect, useRef, useState } from 'react';
import { UseInfiniteScrollProps } from './props';
import { debounce } from 'lodash';

export default function useInfiniteScroll({
  hasMore,
  isLoading,
  loadMore,
  condition = true,
  reverse = false,
}: UseInfiniteScrollProps) {
  const ref = useRef<any>(null);
  const [distanceBottom, setDistanceBottom] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  //eslint-disable-next-line
  const scrollListener = useCallback(
    debounce(() => {
      if (ref && ref.current) {
        const scrollTop = ref?.current?.scrollTop;
        const bottom = ref.current?.scrollHeight - ref.current?.clientHeight;

        if (!distanceBottom) {
          setDistanceBottom(Math.round(bottom * 0.2));
        }

        if (scrollTop === 0 && hasMore && !isLoading && condition && reverse) {
          loadMore();
        }

        if (scrollTop > bottom - distanceBottom && hasMore && !isLoading && condition && !reverse) {
          loadMore();
        }

        if (scrollTop > bottom - distanceBottom) {
          setIsAtBottom(true);
        } else {
          setIsAtBottom(false);
        }
      }
    }, 100),
    [hasMore, loadMore, isLoading, distanceBottom, reverse, condition, ref],
  );

  useEffect(() => {
    if (!(ref && ref?.current)) {
      return;
    }
    const element = ref?.current;

    element?.addEventListener('scroll', scrollListener);
    return () => {
      element?.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener, ref]);

  return {
    ref,
    isAtBottom,
  };
}
