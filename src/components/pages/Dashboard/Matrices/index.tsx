import { ModalHeader } from '@/components/core/Modal/Header';
import styles from './styles.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useMemo } from 'react';

export default function DashboardMatrices() {
  const { t } = useTranslation('common');

  const Slots = useMemo(
    () =>
      Array.from({ length: 3 }, (_, index) => (
        <div className={styles.card__content__card} key={index}>
          <h3 className={styles.card__content__card__title}>
            {t('slot_label', { slot: index + 1 })}
          </h3>
          <p className={styles.card__content__card__account}>
            {index === 0 ? '2GUnfxsvNf5...S1rSx' : t('empty')}
          </p>
        </div>
      )),
    [],
  );

  return (
    <div className={styles.card}>
      <ModalHeader
        title={t('activate_matrix_label')}
        onClose={() => {}}
        hideCloseButton
      />
      <div className={styles.card__content}>
        <div
          className={`${styles.card__content__card} ${styles['card__content__card--owner']}`}
        >
          <h3 className={styles.card__content__card__title}>
            {t('owner_label')}
          </h3>
          <p className={styles.card__content__card__account}>
            2GUnfxZavKoPfS9svNf5KoPfS9sRojUhprCS1rSx
          </p>
        </div>
        {Slots}
      </div>
    </div>
  );
}
