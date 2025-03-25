import { ErrorCard } from '@/components/core/ErrorCard';
import styles from './styles.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useBinanceKlines, useBinanceTicker } from '@/api/binance/queries';
import useDateFilter from '@/hooks/date-filter/useDateFilter';
import { AreaChart } from '@/components/core/AreaChart';
import { AreaData, WhitespaceData } from 'lightweight-charts';
import DashboardChartHeader from './Header';

export default function DashboardChart() {
  const { t } = useTranslation('common');

  const { startDate, endDate } = useDateFilter();
  const {
    isPending: isTickerPending,
    error: tickerError,
    refetch: refetchTicker,
  } = useBinanceTicker({ symbol: 'SOLUSDT' });
  const {
    chartData,
    isPending: isKlinesPending,
    error: klinesError,
    refetch: refetchKlines,
  } = useBinanceKlines({
    symbol: 'SOLUSDT',
    interval: '1h',
    startTime: startDate.getTime(),
    endTime: endDate.getTime(),
    timeZone: '-3',
    limit: 500,
  });

  const error = tickerError || klinesError;
  const isPending = isTickerPending || isKlinesPending;

  function handleRefetch() {
    if (tickerError) {
      refetchTicker();
    }
    if (klinesError) {
      refetchKlines();
    }
  }

  if (error) {
    return <ErrorCard error={error} refetch={handleRefetch} />;
  }

  return (
    <div className={styles.card}>
      <div className={styles.card__content}>
        <DashboardChartHeader />
        <AreaChart
          data={chartData as unknown as (AreaData | WhitespaceData)[]}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}
