import { useBinanceTicker } from '@/api/binance/queries';
import styles from '../styles.module.scss';
// import { DateRangeCard } from '@donut/common/components';
import useDateFilter from '@/hooks/date-filter/useDateFilter';
import DashboardChartHeaderSkeleton from './Skeleton';
import { useEffect, useState } from 'react';
import { useCountUp } from '@/hooks/useCountUp';

export default function DashboardChartHeader() {
  const { data: tickerData, isPending } = useBinanceTicker({
    symbol: 'SOLUSDT',
  });
  const [isAnimatingIncrease, setIsAnimatingIncrease] = useState(false);
  const [previousBalance, setPreviousBalance] = useState<number>(
    tickerData?.prevClosePrice.toNumber(),
  );
  const { value, reset } = useCountUp({
    end: tickerData?.prevClosePrice.toNumber() ?? 0,
    start: previousBalance ?? 0,
    duration: 1,
    onUpdate: value => {
      setIsAnimatingIncrease(Number(value) > Number(previousBalance));
    },
    onComplete: () => {
      setPreviousBalance(tickerData?.prevClosePrice.toNumber());
    },
  });

  function handleUseCountUpReset() {
    reset();
  }

  useEffect(handleUseCountUpReset, [tickerData?.prevClosePrice?.toNumber()]);

  const { startDate, endDate, handleSetDateRange } = useDateFilter();

  if (isPending) {
    return <DashboardChartHeaderSkeleton />;
  }

  return (
    <div className={styles.card__header}>
      <div className={styles.card__header__wrapper}>
        <div
          className={`${styles.card__header__wrapper__title} ${isAnimatingIncrease ? styles['card__header__wrapper__title--up'] : styles['card__header__wrapper__title--down']}`}
        >
          {value}
        </div>
        <div className={styles.card__header__wrapper__column}>
          <div className={styles.card__header__wrapper__pair}>SOL/USDT</div>
          <div
            className={`${styles.card__header__wrapper__result} ${tickerData?.priceChange.isNegative() ? styles['card__header__wrapper__result--negative'] : ''}`}
          >
            {tickerData?.priceChange.toNumber()} (
            {tickerData?.priceChangePercent.toNumber()}%)
          </div>
        </div>
      </div>
      {/* <DateRangeCard
        range={[startDate, endDate]}
        setRange={handleSetDateRange}
        hidePicker
        isDefault
      /> */}
    </div>
  );
}
