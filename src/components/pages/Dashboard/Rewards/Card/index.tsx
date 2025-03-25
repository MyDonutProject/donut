import styles from './styles.module.scss';
import { RewardsCardProps } from './props';
import RewardsCardImage from './Image';

export default function RewardsCard({ title, value, image }: RewardsCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.container__title}>{title}</div>
      <div className={styles.container__value}>{value}</div>
      <RewardsCardImage image={image} />
    </div>
  );
}
