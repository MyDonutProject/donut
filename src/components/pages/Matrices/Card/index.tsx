import useTranslation from "next-translate/useTranslation";
import { MatrixCardProps } from "./props";
import styles from "./styles.module.scss";

export default function MatrixCard({ title, slots, status }: MatrixCardProps) {
  const { t } = useTranslation("common");

  return (
    <div className={styles.card}>
      <div className={styles.card__row}>
        <div className={styles.card__row__title}>{title}</div>
        <div
          className={`${styles.card__content__slot__chip} ${
            styles[`card__content__slot__chip--${status}`]
          }`}
        >
          <div
            className={`${styles.card__content__slot__chip__label} ${
              styles[`card__content__slot__chip__label--${status}`]
            }`}
          >
            <i
              className={
                status === "completed"
                  ? "fa-solid fa-check"
                  : "fa-solid fa-clock"
              }
            />
            {t(status) as string}
          </div>
        </div>
      </div>
      <div className={styles.card__content}>
        {slots.map((slot, index) => (
          <div
            className={`${styles.card__content__slot} ${
              styles[
                `card__content__slot--${
                  !!slot?.address ? "completed" : "pending"
                }`
              ]
            }`}
          >
            <div
              className={`${styles.card__content__slot__title} ${
                !!slot?.address
                  ? styles[`card__content__slot__title--completed`]
                  : ""
              }`}
            >
              {index + 1}
            </div>
            <div className={styles.card__content__slot__address}>
              {slot.address ? slot.address : t("empty")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
