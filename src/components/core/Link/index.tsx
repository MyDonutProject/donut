import useTranslation from 'next-translate/useTranslation';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { CoreLinkProps } from './props';
import { ModalsKey } from '@/enums/modalsKey';

export default function Link({
  as,
  children,
  href,
  replace,
  scroll,
  shallow,
  modal,
  privateRoute = false,
  ...rest
}: CoreLinkProps) {
  const { lang } = useTranslation('common');
  const { prefetch, pathname } = useRouter();

  function getHref() {
    if (privateRoute) {
      return `${pathname}#${ModalsKey.Login}`;
    }


    return `${String(href).startsWith('/') ? href : `/${href}`}`;
  }

  function onMouseEnter() {
    prefetch(getHref());
  }

  return (
    //@ts-ignore
    <NextLink
      {...rest}
      as={as}
      href={getHref()}
      lang={lang}
      passHref
      replace={replace}
      scroll={!!modal ? false : scroll}
      aria-disabled={rest?.disabled}
      shallow={!!modal ? true : shallow}
      aria-label={`Link to ${typeof href == 'object' ? JSON.stringify(href) : href}`}
      onMouseEnter={onMouseEnter}
      onTouchStart={onMouseEnter}
    >
      {children}
    </NextLink>
  );
}
