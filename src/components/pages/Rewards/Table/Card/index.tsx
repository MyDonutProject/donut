import { WalletService } from "@/services/WalletService"
import { CardProps } from "./props"
import styles from "./styles.module.scss"
import { RootState } from "@/store"
import { useSelector } from "react-redux"
import CardSkeleton from "./Skeleton"

export default function Card({ item, locked, isLoading }: CardProps) {
  const price = useSelector((state: RootState) => state.hermes.price)
  const dntPrice = useSelector(
    (state: RootState) => state.hermes.dntPrice
  )

  if (isLoading) {
    return <CardSkeleton />
  }

  return (
    <div
      className={`${styles.card} ${
        locked ? styles["card--locked"] : ""
      }`}
    >
      <div className={styles.card__wrapper}>
        <img
          className={styles.card__image}
          src={
            item.symbol === "SOL"
              ? "/donut/sol/sol.png"
              : "/donut/assets/donut.png"
          }
        ></img>
        <div className={styles.card__column}>
          <div className={styles.card__column__title}>
            {item.symbol}
          </div>
          <div className={styles.card__column__value}>
            {Intl.DateTimeFormat("en-US", {
              dateStyle: "short",
            }).format(new Date(item.createdAt))}
          </div>
        </div>
      </div>
      <div
        className={`${styles.card__column} ${styles["card__column--end"]}`}
      >
        <div
          className={`${styles.card__column__title} ${styles["card__column__title--primary"]}`}
        >
          <i
            className={
              locked ? "fa-solid fa-lock" : "fa-solid fa-plus"
            }
          />
          {`${item.amount?.toNumberString()} ${item.symbol}`}
        </div>
        <div className={styles.card__column__value}>
          {WalletService.maskCurrency({
            amount:
              item.symbol === "SOL"
                ? item.amount.multiply(price).toNumber()
                : item.amount.multiply(dntPrice).toNumber(),
          })}
        </div>
      </div>
    </div>
  )
}
