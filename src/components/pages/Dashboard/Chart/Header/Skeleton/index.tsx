import styles from '../../styles.module.scss';
// import { DateRangeCard } from '@donut/common/components';
import skeleton from './styles.module.scss';

export default function DashboardChartHeaderSkeleton() {
  return (
    <div className={styles.card__header}>
      <div className={styles.card__header__wrapper}>
        <div className={skeleton.title} />
        <div className={styles.card__header__wrapper__column}>
          <div className={skeleton.pair} />
          <div className={skeleton.spacer} />
          <div className={skeleton.result} />
        </div>
      </div>
      {/* <DateRangeCard
        range={[new Date(), new Date()]}
        setRange={() => {}}
        hidePicker
        isLoading
        isDefault
      /> */}
    </div>
  );
}
