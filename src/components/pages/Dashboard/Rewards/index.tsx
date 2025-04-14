import { useUserTransactions } from "@/api/transactions";
import { ModalHeader } from "@/components/core/Modal/Header";
import { Decimal } from "@/lib/Decimal";
import useTranslation from "next-translate/useTranslation";
import RewardsCard from "./Card";
import styles from "./styles.module.scss";

export default function DashboardRewards() {
  const { t } = useTranslation("common");
  const { sumDonuts, sumSolanas } = useUserTransactions();

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
            sumDonuts !== null
              ? Decimal.fromSubunits(sumDonuts?.toString(), {
                  scale: 9,
                }).toNumberString()
              : null
          }
          image={"/donut/assets/donut.png"}
        />
        <RewardsCard
          title={t("earned_solanas")}
          value={
            sumSolanas !== null
              ? Decimal.fromSubunits(sumSolanas?.toString(), {
                  scale: 9,
                }).toNumberString()
              : null
          }
          image={"/donut/sol/sol.png"}
        />
      </div>
    </div>
  );
}
