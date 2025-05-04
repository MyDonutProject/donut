import useAccount from "@/hooks/account/useAccount";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import styles from "./styles.module.scss";

export default function ConnectWalletButton() {
  const { t } = useTranslation("common");
  const { isConnected } = useAccount();
  const { setVisible } = useWalletModal();
  const { query } = useRouter();
  const bypass = query.bypass as string;

  const handleConnect = () => {
    setVisible(true);
  };

  if (isConnected || !bypass) {
    return null;
  }

  return (
    <div className={styles.container} onClick={handleConnect}>
      <i className={`${styles.container__icon} fa-solid fa-wallet`} />
      <div className={styles.container__column}>
        <div className={styles.container__column__row}>
          <h3 className={styles.container__column__title}>
            {t("connect_wallet")}
          </h3>
          <img
            src={"/donut/providers/phantom.png"}
            className={styles.container__column__row__icon}
          />
        </div>
        <p className={styles.container__column__description}>
          {t("seo:title")}
        </p>
      </div>
      <i
        className={`${styles.container__icon} ${styles["container__icon--smaller"]} fa-solid fa-chevron-right`}
      />
    </div>
  );
}
