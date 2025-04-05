import { Image } from "@/components/core/Image";
import useTranslation from "next-translate/useTranslation";
import styles from "./styles.module.scss";

export default function BuyHere() {
  const { t } = useTranslation("common");

  return (
    <a
      href="https://app.meteora.ag/pools#stake2earnpools"
      target="_blank"
      className={styles.container}
    >
      <h2 className={styles.container__title}>{t("buy_here")}</h2>
      <Image
        src="/donut/assets/m3m3.png"
        alt="buy-here"
        className={styles.container__image}
        fetchPriority="low"
        loading="lazy"
      />
    </a>
  );
}
