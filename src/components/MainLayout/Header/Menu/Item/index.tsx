import styles from './styles.module.scss';
import { HeaderMenuProps } from './props';
import Link from '@/components/core/Link';
import useIsHomePage from '@/hooks/layout/useIsHomePage';
import useTranslation from 'next-translate/useTranslation';
import { memo } from 'react';

function HeaderMenuItem({ item, isActive }: HeaderMenuProps) {
  const { t } = useTranslation('common');
  const { isHomePage } = useIsHomePage();

  return (
    <Link href={item.path}>
      <div
        className={`${styles.item} ${isActive ? styles['item--active'] : ''} ${!isHomePage ? styles['item--home'] : ''} ${!isHomePage && isActive ? styles['item--home--active'] : ''}`}
      >
        <i className={item.icon} />
        {t(item.label) as string}
      </div>
    </Link>
  );
}

export default memo(HeaderMenuItem);
