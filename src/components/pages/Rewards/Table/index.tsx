import { useUserBalance } from "@/api/balance";
import { NoDataComponent } from "@/components/core/NoDataComponent";
import { Decimal } from "@/lib/Decimal";
import useTranslation from "next-translate/useTranslation";
import { useMemo } from "react";
import Card from "./Card";
import styles from "./styles.module.scss";

export default function RewardsTable() {
  const { t } = useTranslation("common");
  const { data: userBalance } = useUserBalance();

  const donuts =
    [userBalance?.reservedTokens].map((t) => ({
      symbol: "donut",
      amount: Decimal.fromSubunits(t?.toString(), {
        scale: 9,
      }).toNumberString(),
      conversion: 0,
      createdAt: new Date(),
      locked: true,
    })) || [];

  const solanas =
    [userBalance?.reservedSol].map((t) => ({
      symbol: "sol",
      amount: Decimal.fromSubunits(t?.toString(), {
        scale: 9,
      }).toNumberString(),
      conversion: 0,
      createdAt: new Date(),
      locked: true,
    })) || [];

  const Donuts = useMemo(
    () =>
      donuts.map((item, index) => (
        //@ts-ignore
        <Card item={item} key={`donut-card-${index}`} />
      )),
    [donuts]
  );

  const Solanas = useMemo(
    () =>
      solanas.map((item, index) => (
        //@ts-ignore
        <Card item={item} key={`solana-card-${index}`} />
      )),
    [solanas]
  );

  return (
    <div className={styles.container}>
      <div className={styles.container__row}>
        <div className={styles.container__row__heading}>
          {t("minted_donuts")}
        </div>
      </div>
      {Donuts}
      <div className={styles.container__row}>
        <div className={styles.container__row__heading}>{t("earned_sol")}</div>
      </div>
      {Solanas?.length > 0 && Solanas}
      {Solanas?.length === 0 && <NoDataComponent />}
    </div>
  );
}
