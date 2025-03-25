import { LinkProps } from 'next/link';
import { HTMLProps } from 'react';
import { ModalsKey } from '@/enums/modalsKey';

export type CoreLinkProps = Omit<LinkProps, 'href'> &
  HTMLProps<HTMLAnchorElement> & {
    href?: string | any | undefined;
    modal?: ModalsKey | string;
    privateRoute?: boolean;
    children: React.ReactNode;
  };
