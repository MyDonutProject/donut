import useTranslation from 'next-translate/useTranslation';
import styles from './styles.module.scss';
import { useMemo } from 'react';

export default function CommunityDriven() {
  const { t } = useTranslation('common');

  const Items = useMemo(
    () =>
      ['active', 'share', 'claim'].map(item => (
        <div className={styles.container__wrapper__item}>{t(item)}</div>
      )),
    [],
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.container__title}>
        {t('community_driven_growth')}
      </h2>
      <div className={styles.container__wrapper}>{Items}</div>
    </div>
  );
}
