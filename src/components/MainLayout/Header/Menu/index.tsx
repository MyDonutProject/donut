    import Link from '@/components/core/Link';
import styles from './styles.module.scss';
import useAccount from '@/hooks/account/useAccount';
import { useMemo } from 'react';
import pages from '@/constants/pages';
import HeaderMenuItem from './Item';
import { useRouter } from 'next/router';
import { StaggerAnimation } from '@/components/core/Animation/Stagger';

export default function HeaderMenu() {
  const { isConnected } = useAccount();
  const { pathname } = useRouter();

  const Items = useMemo(
    () =>
      pages.map(page => (
        <HeaderMenuItem item={page} isActive={pathname.includes(page.path)} />
      )),
    [pathname],
  );

  if (!isConnected) {
    return null;
  }

  return (
    <StaggerAnimation
      direction="row"
      stagger={0.1}
      staggerDirection="up"
      className={styles.container}
    >
      {Items}
    </StaggerAnimation>
  );
}
