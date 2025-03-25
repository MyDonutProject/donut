import useTranslation from 'next-translate/useTranslation';
import styles from './styles.module.scss';
import { ModalHeader } from '@/components/core/Modal/Header';
import RewardsCard from './Card';

export default function DashboardRewards() {
  const { t } = useTranslation('common');

  return (
    <div className={styles.container}>
      <ModalHeader
        title={t('my_rewards_label')}
        onClose={() => {}}
        hideCloseButton
      />
      <div className={styles.container__content}>
        <RewardsCard
          title={t('minted_donuts')}
          value={'0.0000000'}
          image={'/donut/assets/donut.png'}
        />
        <RewardsCard
          title={t('earned_solanas')}
          value={'0.0000000'}
          image={'/donut/sol/sol.png'}
        />
      </div>
    </div>
  );
}
