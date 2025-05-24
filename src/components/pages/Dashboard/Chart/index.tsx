import { ErrorCard } from "@/components/core/ErrorCard"
import styles from "./styles.module.scss"
import useTranslation from "next-translate/useTranslation"
import useDateFilter from "@/hooks/date-filter/useDateFilter"
import { AreaChart } from "@/components/core/AreaChart"
import { AreaData, WhitespaceData } from "lightweight-charts"
import DashboardChartHeader from "./Header"
import { useBinanceKlines } from "@/api/binance"

export default function DashboardChart() {
  const { t } = useTranslation("common")

  const { startDate, endDate } = useDateFilter()
  //
  const {
    chartData,
    isPending: isKlinesPending,
    error: klinesError,
    refetch: refetchKlines,
  } = useBinanceKlines({
    symbol: "SOLUSDT",
    interval: "1h",
    startTime: startDate.getTime(),
    endTime: endDate.getTime(),
    timeZone: "-3",
    limit: 500,
  })

  const error = klinesError
  const isPending = isKlinesPending

  function handleRefetch() {
    if (klinesError) {
      refetchKlines()
    }
  }

  if (error) {
    return <ErrorCard error={error} refetch={handleRefetch} />
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
  )
}
