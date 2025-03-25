import { SelectInputWithImageSkeletonProps } from './props';

import styles from '../styles.module.scss';
import skeleton from './styles.module.scss';

export default function SelectInputWithImageSkeleton({
  cardBg,
}: SelectInputWithImageSkeletonProps) {
  return (
    <div
      className={`${styles.input} ${cardBg ? styles['input--card-bg'] : ''} `}
    >
      <div className={styles.input__wrapper}>
        <div
          className={styles.input__image}
        />
        <div
          className={`${skeleton.text} ${cardBg ? skeleton['text--secondary'] : ''}`}
        />
        <div
          className={`${skeleton.chevron} ${cardBg ? skeleton['chevron--secondary'] : ''}`}
        />
      </div>
    </div>
  );
}
