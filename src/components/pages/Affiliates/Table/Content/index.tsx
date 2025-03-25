import { useMemo } from 'react';
import { options } from '../Header/Select/options';
import styles from './styles.module.scss';
import useTranslation from 'next-translate/useTranslation';
import AffiliatesCard from './Card';
import { StaggerAnimation } from '@/components/core/Animation/Stagger';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

export default function AffiliatesTableContent() {
  const { t } = useTranslation('common');
  const filter = useSelector(
    (state: RootState) => state.affiliatesFilter.filter,
  );

  const affiliates = options
    .filter(option => !!option.image)
    .map((option, index) => ({
      name: option.label,
      date: new Date(),
      rank: option,
      address: '0x1234567...abcdef',
      position: (index + 1) * 5,
    }))
    .filter(affiliate => {
      if (!filter) return true;
      return affiliate.rank.label === filter;
    });

  if (affiliates?.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.container__row}>
          <img
            className={styles.container__image}
            src="/donut/assets/no-data.png"
            alt="none"
          />
          <p className={styles.container__description}>{t('no_referrals')}</p>
        </div>
      </div>
    );
  }

  const Affiliates = useMemo(
    () =>
      affiliates.map(affiliate => (
        <AffiliatesCard {...affiliate} key={affiliate.name} />
      )),
    [affiliates],
  );

  return (
    <StaggerAnimation
      className={styles.container}
      direction="column"
      stagger={0.1}
      staggerDirection="up"
    >
      {Affiliates}
    </StaggerAnimation>
  );
}
