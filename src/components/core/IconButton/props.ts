import { PropsWithChildren } from 'react';

export interface IconButtonProps extends PropsWithChildren {
  onClick: VoidFunction;
  id?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  iconOnly?: boolean;
  small?: boolean;
  isContainerColor?: boolean;
  border?: boolean;
}
