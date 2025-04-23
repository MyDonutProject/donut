import { Button } from "@/components/core/Button";
import { ModalsKey } from "@/enums/modalsKey";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import styles from "./styles.module.scss";
export default function LanguageButton() {
  const { t, lang } = useTranslation("common");
  const { push } = useRouter();

  function handleLanguageModal() {
    push({
      hash: ModalsKey.Language,
    });
  }

  return (
    <Button
      onClick={handleLanguageModal}
      useMaxContent
      className={styles.button}
    >
      <i className="fad fa-chevron-up" />
      {t(lang)}
    </Button>
  );
}
