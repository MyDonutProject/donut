import { useMemo } from 'react';
import styles from './styles.module.scss';
import { socials } from './socials';
import Link from 'next/link';

export default function Footer() {
  const Icons = useMemo(
    () =>
      socials.map((icon) => (
        <Link key={icon.icon} href={icon.url} className={styles.container__icon} target='_blank'>
          <i className={icon.icon} />
        </Link>
      )),
    [],
  );
  return <div className={styles.container}>{Icons}</div>;
}
