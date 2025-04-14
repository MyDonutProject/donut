import RewardsCardImage from "./Image";
import { RewardsCardProps } from "./props";
import styles from "./styles.module.scss";

export default function RewardsCard({ title, value, image }: RewardsCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.container__title}>{title}</div>
      <div className={styles.container__value}>
        {value ? value : <div className={styles["value-skeleton"]} />}
      </div>
      <RewardsCardImage image={image} />
    </div>
  );
}
