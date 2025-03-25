import { ReactNode } from 'react';

export interface LayoutProps {
  title?: string;
  titleComponent?: ReactNode;
  titleClassName?: string;
  actionComponent?: ReactNode;
  largerContainer?: boolean;
}
