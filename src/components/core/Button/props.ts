import { MutableRefObject } from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  visible?: boolean;
  isloading?: boolean;
  isSecondary?: boolean;
  isSmall?: boolean;
  isTiny?: boolean;
  isSkeleton?: boolean;
  isErrorButton?: boolean;
  useMaxContent?: boolean;
  isActive?: boolean;
  textColor?: string;
  isLinkButton?: boolean;
  isTransparent?: boolean;
  skeletonDefault?: boolean;
  icon?: string;
  dotted?: boolean;
  ref?: MutableRefObject<HTMLButtonElement>;
}
