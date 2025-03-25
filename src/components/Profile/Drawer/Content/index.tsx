import styles from './styles.module.scss';
import ProfileDrawerContentNavigation from './Navigation/Common';
import ProfileDrawerContentNavigationSettings from './Navigation/Settings';
import LogoutButton from '@/components/MainLayout/Header/LogoutButton';
import { StaggerAnimation } from '@/components/core/Animation/Stagger';

export default function ProfileDrawerContent() {
  return (
    <div className={styles.container}>
      <StaggerAnimation
        direction="column"
        stagger={0.15}
        staggerDirection="up"
        className={styles.container__content}
      >
        <ProfileDrawerContentNavigation />
        <ProfileDrawerContentNavigationSettings />
        <LogoutButton />
      </StaggerAnimation>
    </div>
  );
}
