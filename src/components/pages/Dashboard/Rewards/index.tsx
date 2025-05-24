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
          title={t("reserved_donuts")}
          value={
            isPendingWalletTracker
              ? null
              : !!userWalletTracker?.totalDonutReward
              ? Decimal.fromSubunits(
                  userWalletTracker?.totalDonutReward?.toString(),
                  {
                    scale: 9,
                  }
                ).toNumberString()
              : "0"
          }
          image={"/donut/assets/donut.png"}
        />
        <RewardsCard
          title={t("reserved_solanas")}
          value={
            isPendingWalletTracker
              ? null
              : !!userWalletTracker?.totalSolReward
              ? Decimal.fromSubunits(
                  userWalletTracker?.totalSolReward?.toString(),
                  {
                    scale: 9,
                  }
                ).toNumberString()
              : "0"
          }
          image={"/donut/sol/sol.png"}
        />
      </div>
    </div>
  )
}
