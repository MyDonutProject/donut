import useTranslation from "next-translate/useTranslation"
import { MatrixCardProps } from "./props"
import styles from "./styles.module.scss"
import { MatrixStatusId } from "@/models/matrices/statuses/id"
import { formatLargeString } from "@/utils/formatLargeString"

export default function MatrixCard({
  title,
  slots,
  status,
}: MatrixCardProps) {
  const { t, lang } = useTranslation("common")

  return (
    <div className={styles.card}>
      <div className={styles.card__row}>
        <div className={styles.card__row__title}>{title}</div>
        <div
          className={`${styles.card__content__slot__chip} ${
            styles[`card__content__slot__chip--${status?.id}`]
          }`}
        >
          <div
            className={`${styles.card__content__slot__chip__label} ${
              styles[
                `card__content__slot__chip__label--${status?.id}`
              ]
            }`}
          >
            <i
              className={
                status?.id?.toString() ===
                MatrixStatusId.Completed.toString()
                  ? "fa-solid fa-check"
                  : "fa-solid fa-clock"
              }
            />
            {status?.name?.[lang]}
          </div>
        </div>
      </div>
      <div className={styles.card__content}>
        {slots.map((slot, index) => (
          <div
            className={`${styles.card__content__slot} ${
              styles[
                `card__content__slot--${
                  !!slot?.referral?.address ? "completed" : "pending"
                }`
              ]
            }`}
          >
            <div
              className={`${styles.card__content__slot__title} ${
                !!slot?.referral?.address
                  ? styles[`card__content__slot__title--completed`]
                  : ""
              }`}
            >
              {index + 1}
            </div>
            <div className={styles.card__content__slot__address}>
              {slot?.referral?.address
                ? formatLargeString(
                    slot?.referral?.address?.toString()
                  )
                : t("empty")}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
