import useTranslation from "next-translate/useTranslation";
import { useMemo } from "react";
import { useTypewriter } from "../../../../hooks/useTypewriter";
import styles from "./styles.module.scss";

export default function Phrases() {
  const { t } = useTranslation("common");

  const items = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => `${t(`${index}_vantage_label`)}`),
    []
  );

  const { currentText, isTyping } = useTypewriter({
    texts: items,
    typingSpeed: 50,
    deletingSpeed: 10,
    delayBetweenTexts: 1000,
  });

  return (
    <div className={styles.container}>
      <strong className={styles.container__static}>
        {t("dozens_of_vantages").replace(".", ":")}
      </strong>
      <strong className={styles.container__items}>
        <strong className={styles.container__animated}>
          {currentText}
          {isTyping && <span className={styles.cursor}>|</span>}
        </strong>
      </strong>
    </div>
  );
}
