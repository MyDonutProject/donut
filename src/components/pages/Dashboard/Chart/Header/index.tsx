import { WalletService } from "@/services/WalletService";
import styles from "../styles.module.scss";
// import { DateRangeCard } from '@donut/common/components';
import { useCountUp } from "@/hooks/useCountUp";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DashboardChartHeader() {
  const { decimalPrice } = useSelector((state: RootState) => state.hermes);
  const [isAnimatingIncrease, setIsAnimatingIncrease] = useState(false);

  const [previousBalance, setPreviousBalance] = useState<number>(
    decimalPrice.toNumber()
  );
  const { value, reset } = useCountUp({
    end: decimalPrice.toNumber(),
    start: previousBalance ?? 0,
    duration: 1,
    formatter(value) {
      return WalletService.maskCurrency({
        amount: value,
      });
    },
    onUpdate: (value) => {
      setIsAnimatingIncrease(Number(value) > Number(previousBalance));
    },
    onComplete: () => {
      setPreviousBalance(decimalPrice.toNumber());
    },
  });

  function handleUseCountUpReset() {
    reset();
  }

  useEffect(handleUseCountUpReset, [decimalPrice.toNumber()]);

  return (
    <div className={styles.card__header}>
      <div className={styles.card__header__wrapper}>
        <div
          className={`${styles.card__header__wrapper__title} ${
            isAnimatingIncrease
              ? styles["card__header__wrapper__title--up"]
              : styles["card__header__wrapper__title--down"]
          }`}
        >
          {value}
        </div>
        <div className={styles.card__header__wrapper__column}>
          <div className={styles.card__header__wrapper__pair}>SOL/USDT</div>
        </div>
      </div>
    </div>
  );
}
