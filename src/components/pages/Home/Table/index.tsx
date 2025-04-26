import useTranslation from "next-translate/useTranslation";
import { useMemo } from "react";
import styles from "./styles.module.scss";

const items = [
  "community_distribution_description",
  "system_description",
  "gradative_distribution",
  "continuous_liquidity",
  "total_transparency",
  "ranking_system",
  "reward_system",
  "more_then_meme",
];

function Table() {
  const { t } = useTranslation("common");

  const Items = useMemo(
    () =>
      items.map((item) => (
        <div className={styles.container__list__item} key={item}>
          {t(item) as string}
          <span className={styles.container__list__item__cross}>✗</span>
        </div>
      )),
    [t]
  );

  const DonutItems = useMemo(
    () =>
      items.map((item) => (
        <div
          className={`${styles.container__list__item} ${styles["container__list__item--donut"]}`}
          key={`${item}-donut`}
        >
          <span
            className={`${styles.container__list__item__cross} ${styles["container__list__item__cross--donut"]}`}
          >
            ✓
          </span>
        </div>
      )),
    []
  );
  {
  }

  return (
    <div className={styles.content}>
      <table className={styles.container}>
        <thead>
          <tr className={styles.container__row}>
            <th className={styles.container__heading}>
              <div
                className={`${styles.container__heading__wrapper} ${styles["container__heading__wrapper--other-memes"]}`}
              >
                <div className={styles.container__heading__detail}>
                  <div className={styles.container__heading__detail__text}>
                    {t("make_dev_rich")}
                  </div>
                  <img
                    src="/donut/assets/arrow.png"
                    className={styles.container__heading__detail__image}
                  />
                </div>
                {t("other_memes") as string}
                <img
                  src="/donut/assets/coins.png"
                  alt="donut"
                  className={styles.container__heading__wrapper__image}
                />
              </div>
            </th>
            <th className={styles.container__heading}>
              <div
                className={`${styles.container__heading__detail} ${styles["container__heading__detail--donut"]}`}
              >
                <div
                  className={`${styles.container__heading__detail__text} ${styles["container__heading__detail__text--donut"]}`}
                >
                  {t("make_you_rich")}
                </div>
                <img
                  src="/donut/assets/arrow.png"
                  className={`${styles.container__heading__detail__image} ${styles["container__heading__detail__image--donut"]}`}
                />
              </div>
              <img
                src="/donut/logo/logo.png"
                alt="donut"
                className={`${styles.container__heading__wrapper__image} ${styles["container__heading__wrapper__image--donut"]}`}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles.container__row}>
            <td className={styles.container__list}>{Items}</td>
            <td className={styles.container__list}>
              <div className={styles.container__list__background} />
              {DonutItems}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
