import { Button } from "@/components/core/Button";
import { RichTooltip } from "@/components/core/RichTooltip";
import { ModalsKey } from "@/enums/modalsKey";
import { useModal } from "@/hooks/modal";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import LanguageModalContent from "../Modal/Content";
import styles from "./styles.module.scss";

export default function LanguageButton() {
  const { isOpen, onClose, handleContainer } = useModal(ModalsKey.Language);
  const { t, lang } = useTranslation("common");
  const { push } = useRouter();

  function handleLanguageModal() {
    push({
      hash: ModalsKey.Language,
    });
  }

  return (
    <RichTooltip
      open={isOpen}
      onClose={onClose}
      content={<LanguageModalContent />}
      unsetHeight
    >
      <Button
        onClick={handleLanguageModal}
        useMaxContent
        className={styles.button}
      >
        {t(lang)}
        <i className="fad fa-chevron-up" />
      </Button>
    </RichTooltip>
  );
}
