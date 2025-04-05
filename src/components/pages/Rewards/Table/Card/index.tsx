import { WalletService } from "@/services/WalletService";
import { CardProps } from "./props";
import styles from "./styles.module.scss";

export default function Card({ item }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.card__wrapper}>
        <img
          className={styles.card__image}
          src={
            item.symbol === "sol"
              ? "/donut/sol/sol.png"
              : "/donut/assets/donut.png"
          }
        ></img>
        <div className={styles.card__column}>
          <div className={styles.card__column__title}>{item.symbol}</div>
          <div className={styles.card__column__value}>
            {Intl.DateTimeFormat("en-US", {
              dateStyle: "short",
            }).format(item.createdAt)}
          </div>
        </div>
      </div>
      <div className={`${styles.card__column} ${styles["card__column--end"]}`}>
        <div
          className={`${styles.card__column__title} ${styles["card__column__title--primary"]}`}
        >{`+${item.amount} ${item.symbol}`}</div>
        <div className={styles.card__column__value}>
          {WalletService.maskCurrency({ amount: item.conversion })}
        </div>
      </div>
    </div>
  );
}
