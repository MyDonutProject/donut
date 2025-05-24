import { useUserBalance } from "@/api/balance"
import { ModalHeader } from "@/components/core/Modal/Header"
import { Decimal } from "@/lib/Decimal"
import useTranslation from "next-translate/useTranslation"
import RewardsCard from "./Card"
import styles from "./styles.module.scss"
import { useUserWalletTracker } from "@/api/wallet"

export default function DashboardRewards() {
  const { t } = useTranslation("common")
  const {
    data: userWalletTracker,
    isPending: isPendingWalletTracker,
  } = useUserWalletTracker()

  return (
    <div className={styles.container}>
      <ModalHeader
        title={t("my_rewards_label")}
        onClose={() => {}}
        hideCloseButton
      />
      <div className={styles.container__content}>
        <RewardsCard
          title={t("minted_donuts")}
          value={
            isPendingWalletTracker
              ? null
              : userWalletTracker?.totalDonutReward?.toNumberString()
          }
          image={"/donut/assets/donut.png"}
        />
        <RewardsCard
          title={t("earned_sol")}
          value={
            isPendingWalletTracker
              ? null
              : userWalletTracker?.totalSolReward?.toNumberString()
          }
          image={"/donut/sol/sol.png"}
        />
      </div>
    </div>
  )
}
