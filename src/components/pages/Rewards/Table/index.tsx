import useTranslation from "next-translate/useTranslation";
import { useMemo } from "react";
import Card from "./Card";
import styles from "./styles.module.scss";

export default function RewardsTable() {
  const { t } = useTranslation("common");

  const donuts = [
    {
      symbol: "donut",
      amount: 500,
      conversion: 100,
      createdAt: new Date(),
    },
    {
      symbol: "donut",
      amount: 500,
      conversion: 100,
      createdAt: new Date(),
    },
    {
      symbol: "donut",
      amount: 500,
      conversion: 100,
      createdAt: new Date(),
    },
  ];

  const solanas = [
    {
      symbol: "sol",
      amount: 0.5,
      conversion: 100,
      createdAt: new Date(),
    },
    {
      symbol: "sol",
      amount: 0.5,
      conversion: 100,
      createdAt: new Date(),
    },
    {
      symbol: "sol",
      amount: 0.5,
      conversion: 100,
      createdAt: new Date(),
    },
  ];

  const Donuts = useMemo(
    () =>
      donuts.map((item, index) => (
        <Card item={item} key={`donut-card-${index}`} />
      )),
    [donuts]
  );

  const Solanas = useMemo(
    () =>
      solanas.map((item, index) => (
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
      {Solanas}
    </div>
  );
}
