import styles from "./styles.module.scss";
import useTranslation from "next-translate/useTranslation";
import AvatarSkeleton from "./Skeleton";
import { useCallback } from "react";
import { ModalsKey } from "@/enums/modalsKey";
import { useRouter } from "next/router";
import { useModal } from "@/hooks/modal";

export default function Avatar() {
  const { t: tRoles } = useTranslation("roles");

  const { isOpen, onClose } = useModal(ModalsKey.ProfileDetails);
  const { push } = useRouter();

  const handleToogleNav = useCallback(() => {
    if (isOpen) {
      onClose();
      return;
    }

    push({
      hash: ModalsKey.ProfileDetails,
    });
  }, [push, isOpen, onClose]);

  return (
    <div className={styles["tooltip-container"]}>
      <div className={styles.container} onClick={handleToogleNav}>
        <div className={styles.container__column}>
          <span className={styles.container__username}>username</span>
        </div>
        <i
          className={`fas fa-chevron-down ${styles.container__chevron} ${
            isOpen ? styles["container__chevron--open"] : ""
          }`}
        />
      </div>
    </div>
  );
}
