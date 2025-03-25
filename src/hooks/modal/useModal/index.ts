import { ModalsKey } from '@/enums/modalsKey';
import { MouseEvent, useCallback } from 'react';
import { useRouter } from 'next/router';

export function useModal(key: ModalsKey) {
  const router = useRouter();
  const { pathname } = router;
  const isOpen: boolean = router.asPath.includes(`#${key}`);

  const onClose = useCallback(
    (clearParams = true) => {
      router.push(
        {
          pathname,
        },
      );
    },
    [pathname, router],
  );
  function handleContainer(event: MouseEvent<HTMLDivElement>): void {
    event.stopPropagation();
  }

  return {
    isOpen,
    onClose,
    handleContainer,
  };
}
