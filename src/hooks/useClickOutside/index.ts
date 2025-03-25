import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { UseClickOutsideProps } from './props';

export default function useClickOutside({
  onClickOutside,
  open,
  disabled = false,
  customRef,
}: UseClickOutsideProps): MutableRefObject<any> {
  const ref = useRef<HTMLElement>(null);

  const handleClickOutside = useCallback(
    (event: any) => {
      const buttonEl = document?.getElementById('input-select-button');

      if (buttonEl && buttonEl.contains(event.target)) {
        return;
      }

      if (
        ((ref.current && !ref.current.contains(event.target)) ||
          (customRef?.current && !customRef?.current.contains(event.target))) &&
        open &&
        !disabled
      ) {
        onClickOutside();
      }
    },
    [ref, customRef, open, onClickOutside, disabled],
  );

  useEffect(() => {
    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [handleClickOutside]);

  return ref;
}

export type { UseClickOutsideProps };
