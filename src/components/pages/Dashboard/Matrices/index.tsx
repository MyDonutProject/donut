import { useUserAccount } from "@/api/account"
import { ModalHeader } from "@/components/core/Modal/Header"
import useAccount from "@/hooks/account/useAccount"
import { formatLargeString } from "@/utils/formatLargeString"
import useTranslation from "next-translate/useTranslation"
import { useMemo } from "react"
import styles from "./styles.module.scss"
import { useUserMatrices } from "@/api/matrices"

export default function DashboardMatrices() {
  const { t } = useTranslation("common")
  const { data: userAccount } = useUserMatrices()
  const { address } = useAccount()

  const Slots = useMemo(
    () =>
      Array.from({ length: 3 }, (_, index) => {
        const slot = userAccount?.data?.[0]?.slots?.[index] ?? null
        return (
          <div
            className={`${styles.card__content__card} ${
              !slot ? styles["card__content__card--disabled"] : ""
            }`}
            key={slot?.referral?.address?.toString()}
          >
            <h3 className={styles.card__content__card__title}>
              {t("slot_label", { slot: index + 1 })}
            </h3>
            <p className={styles.card__content__card__account}>
              {formatLargeString(
                slot?.referral?.address?.toString() ?? t("empty")
              ) ?? t("empty")}
            </p>
          </div>
        )
      }),
    [userAccount?.data]
  )

  return (
    <div className={styles.card}>
      <ModalHeader
        title={t("my_matrices")}
        onClose={() => {}}
        hideCloseButton
        invertColor
      />
      <div className={styles.card__content}>
        <div
          className={`${styles.card__content__card} ${styles["card__content__card--owner"]}`}
        >
          <h3 className={styles.card__content__card__title}>
            {t("owner_label")}
          </h3>
          <p className={styles.card__content__card__account}>
            {formatLargeString(address)}
          </p>
        </div>
        {Slots}
      </div>
    </div>
  )
}
