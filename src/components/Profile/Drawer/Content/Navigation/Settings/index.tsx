import { useMemo } from 'react';
import styles from './styles.module.scss';
import ProfileDrawerContentNavigationItem from '../Item';
import { navigationSettingsPaths } from './paths';

export default function ProfileDrawerContentNavigationSettings() {
  const Paths = useMemo(
    () =>
      navigationSettingsPaths.map(page => (
        <ProfileDrawerContentNavigationItem
          item={page}
          key={`profile-navigation-${page?.icon}`}
        />
      )),
    [],
  );

  return <div className={styles.container}>{Paths}</div>;
}
