import { useUserBalance } from "@/api/balance";
import { ModalHeader } from "@/components/core/Modal/Header";
import { Decimal } from "@/lib/Decimal";
import useTranslation from "next-translate/useTranslation";
import RewardsCard from "./Card";
import styles from "./styles.module.scss";

export default function DashboardRewards() {
  const { t } = useTranslation("common");
  const { data: userBalance } = useUserBalance();

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
            userBalance?.reservedTokens !== null
              ? Decimal.fromSubunits(userBalance?.reservedTokens?.toString(), {
                  scale: 9,
                }).toNumberString()
              : null
          }
          image={"/donut/assets/donut.png"}
        />
        <RewardsCard
          title={t("reserved_solanas")}
          value={
            userBalance?.reservedSol !== null
              ? Decimal.fromSubunits(userBalance?.reservedSol?.toString(), {
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
