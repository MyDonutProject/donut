import useTranslation from 'next-translate/useTranslation';
import { ProfileDrawerContentNavigationItemProps } from './props';
import styles from './styles.module.scss';
import Link from '@/components/core/Link';
import { useRouter } from 'next/router';

export default function ProfileDrawerContentNavigationItem({
  item,
}: ProfileDrawerContentNavigationItemProps) {
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <Link
      className={`${styles.item} ${item.path === router.pathname ? styles['item--selected'] : ''}`}
      href={item.path}
      modal={item?.modal}
    >
      <div className={styles.item__wrapper}>
        <div className={styles.item__icon}>
          <i className={item?.icon} />
        </div>
        <div className={styles.item__label}>{t(item?.label)}</div>
      </div>
      <div className={styles.item__chevron}>
        <i className="fa-solid fa-chevron-right" />
      </div>
    </Link>
  );
}
