import styles from '../styles.module.scss';
import skeletonStyles from './styles.module.scss';

export default function NotificationRowSkeleton() {
  return (
    <>
      <div className={styles.box}>
        <div className={skeletonStyles['icon-skeleton']} />
      </div>

      <div className={styles.column}>
        <div className={skeletonStyles['title-skeleton']} />
        <div className={skeletonStyles['description-skeleton']} />
        <div className={skeletonStyles['date-skeleton']} />
      </div>
    </>
  );
}
