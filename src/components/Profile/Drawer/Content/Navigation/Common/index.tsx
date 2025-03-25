import { useMemo } from 'react';
import styles from './styles.module.scss';
import ProfileDrawerContentNavigationItem from '../Item';
import pages from '@/constants/pages';
import { PageProps } from '@/types/navigation';

export default function ProfileDrawerContentNavigationCommon() {
  const Paths = useMemo(
    () =>
      pages?.map(page => (
        <ProfileDrawerContentNavigationItem
          item={page as PageProps}
          key={`profile-navigation-${page}`}
        />
      )),
    [],
  );

  return <div className={styles.container}>{Paths}</div>;
}
