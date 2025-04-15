import { useUserAccount } from "@/api/account";
import { StaggerAnimation } from "@/components/core/Animation/Stagger";
import { RootState } from "@/store";
import useTranslation from "next-translate/useTranslation";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import AffiliatesCard from "./Card";
import styles from "./styles.module.scss";

export default function AffiliatesTableContent() {
  const { t } = useTranslation("common");
  const filter = useSelector(
    (state: RootState) => state.affiliatesFilter.filter
  );

  const { data: userAccount } = useUserAccount();

  const affiliates = userAccount?.chain?.slots
    ?.filter((i) => !!i)
    .map((option, index) => ({
      name: "classic",
      date: new Date(),
      rank: "classic",
      address: option?.toString(),
      position: index,
    }));

  if (affiliates?.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.container__row}>
          <img
            className={styles.container__image}
            src="/donut/assets/no-data.png"
            alt="none"
          />
          <p className={styles.container__description}>{t("no_referrals")}</p>
        </div>
      </div>
    );
  }

  const Affiliates = useMemo(
    () =>
      affiliates.map((affiliate) => (
        //@ts-ignore
        <AffiliatesCard {...affiliate} key={affiliate.name} />
      )),
    [affiliates]
  );

  return (
    <StaggerAnimation
      className={styles.container}
      direction="column"
      stagger={0.1}
      staggerDirection="up"
    >
      {Affiliates}
    </StaggerAnimation>
  );
}
