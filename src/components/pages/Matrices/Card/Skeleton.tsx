import styles from "./styles.module.scss"

export default function MatrixCardSkeleton() {
  return (
    <div className={`${styles.card} ${styles.skeleton}`}>
      <div className={styles.card__row}>
        <div
          className={`${styles.card__row__title} ${styles.skeleton__title}`}
        />
        <div
          className={`${styles.card__content__slot__chip} ${styles.skeleton__chip}`}
        >
          <div className={styles.card__content__slot__chip__label} />
        </div>
      </div>
      <div className={styles.card__content}>
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className={`${styles.card__content__slot} ${styles.skeleton__slot}`}
          >
            <div className={styles.card__content__slot__title} />
            <div
              className={`${styles.card__content__slot__address} ${styles.skeleton__address}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
