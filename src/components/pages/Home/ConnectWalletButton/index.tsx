import useAccount from "@/hooks/account/useAccount";
import useTranslation from "next-translate/useTranslation";
import styles from "./styles.module.scss";

export default function ConnectWalletButton() {
  const { t } = useTranslation("common");
  const { isConnected } = useAccount();

  if (isConnected) {
    return null;
  }

  return (
    <div className={styles.container}>
      <i className={`${styles.container__icon} fa-solid fa-wallet`} />
      <div className={styles.container__column}>
        <div className={styles.container__column__row}>
          <h3 className={styles.container__column__title}>
            {t("connect_wallet")}
          </h3>
          <img
            src={"/donut/providers/metamask.png"}
            className={styles.container__column__row__icon}
          />
          <img
            src={"/donut/providers/phantom.png"}
            className={styles.container__column__row__icon}
          />
        </div>
        <p className={styles.container__column__description}>
          {t("connect_wallet_description")}
        </p>
      </div>
      <i
        className={`${styles.container__icon} ${styles["container__icon--smaller"]} fa-solid fa-chevron-right`}
      />
    </div>
  );
}
