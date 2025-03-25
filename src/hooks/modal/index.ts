import { ModalsKey } from '@/enums/modalsKey';
import { MouseEvent } from 'react';
import { useRouter } from 'next/router';

export function useModal(key: ModalsKey) {
  const { push, pathname, asPath } = useRouter();
  const hash = asPath.split?.('#')?.[1];
  const isOpen: boolean = hash === `#${key}`;

  function onClose() {
    push({
      pathname,
    });
  }

  function handleContainer(event: MouseEvent<HTMLDivElement>): void {
    event.stopPropagation();
  }

  return {
    isOpen,
    onClose,
    handleContainer,
  };
}
