import styles from '../styles.module.scss';
import skeletonStyles from './styles.module.scss';

export default function AvatarSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.container__column}>
        <div className={skeletonStyles['username-skeleton']} />
        <div className={skeletonStyles['role-skeleton']} />
      </div>
    </div>
  );
}
