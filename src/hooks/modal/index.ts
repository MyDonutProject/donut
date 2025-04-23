import { ModalsKey } from "@/enums/modalsKey";
import { useRouter } from "next/router";
import { MouseEvent } from "react";

export function useModal(key: ModalsKey) {
  const { push, pathname, asPath } = useRouter();
  const hash = asPath?.includes(`#${key}`) ? `#${key}` : null;
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
