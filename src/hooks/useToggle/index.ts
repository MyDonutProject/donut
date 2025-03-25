import { useCallback, useState } from 'react';

export function useToggle(inititalState = false): [boolean, () => void] {
  const [open, setOpen] = useState<boolean>(inititalState);

  const toggle = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  return [open, toggle];
}
