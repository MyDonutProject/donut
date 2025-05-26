import styles from "../styles.module.scss"
import skeleton from "./styles.module.scss"

export default function CardSkeleton() {
  return (
    <div className={`${styles.card}`}>
      <div className={styles.card__wrapper}>
        <div className={skeleton.image}></div>
        <div className={styles.card__column}>
          <div className={skeleton.title}></div>
          <div className={skeleton.value}></div>
        </div>
      </div>
      <div
        className={`${styles.card__column} ${styles["card__column--end"]}`}
      >
        <div
          className={`${styles.card__column__title} ${styles["card__column__title--primary"]}`}
        >
          <i className={skeleton.icon} />
          <div className={skeleton.title}></div>
        </div>
        <div className={skeleton.value}></div>
      </div>
    </div>
  )
}
