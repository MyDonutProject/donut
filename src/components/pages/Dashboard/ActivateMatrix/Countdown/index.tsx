import { getStore } from "@/store"
import styles from "./styles.module.scss"
import { useChainlinkOracle } from "@/api/price/queries"
import CircularProgress from "@/components/core/CircularProgress"
import { getComputedColor } from "@/utils/theme/colors"
import Color from "color"
import { useCountUp } from "use-count-up"
import { setPrice } from "@/store/hermes/actions"

export default function Countdown() {
  const {
    refetch,
    isPending,
    isRefetching,
    data: price,
  } = useChainlinkOracle()

  const { value, reset } = useCountUp({
    start: 15,
    end: Number(0),
    isCounting: true,
    duration: 15,
    easing: "linear",
    onComplete: () => {
      if (isPending || isRefetching) {
        return
      }

      refetch()
      reset()
      getStore().dispatch(setPrice(price?.price))
    },
  })

  return (
    <div className={styles.container}>
      <CircularProgress
        progress={(Number(value) / 15) * 100}
        pathColor={Color(getComputedColor("var(--warning-color)"))
          .alpha(0.2)
          .toString()}
        trailColor={getComputedColor("var(--warning-color)")}
      />
      <span className={styles.container__label}>{value}s</span>
    </div>
  )
}
