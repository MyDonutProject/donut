import { MutableRefObject } from 'react';

export interface UseClickOutsideProps {
  onClickOutside: () => void;
  open: boolean;
  disabled?: boolean;
  customRef?: MutableRefObject<any>;
}
