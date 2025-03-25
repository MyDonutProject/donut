import styles from './styles.module.scss';
import { AffiliatesCardProps } from './props';
import { useTranslation } from 'react-i18next';

export default function AffiliatesCard({
  name,
  date,
  rank,
  address,
  position,
}: AffiliatesCardProps) {
  const { t } = useTranslation('common');
  return (
    <div className={styles.card}>
      <img
        className={styles.card__image}
        src={`/donut/donuts/${rank.image}`}
        alt={rank.label}
      />
      <div className={styles.card__column}>
        <div className={styles.card__row}>
          <p className={styles.card__row__title}>{t(rank.label)}</p>
          <p className={styles.card__row__position}>#{position}</p>
        </div>
        <p className={styles.card__row__address}>{address}</p>
        <p className={styles.card__row__affiliated_at}>
          {date.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
