import { useUserAccount } from "@/api/account";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { useNotificationService } from "@/hooks/notifications/useNotificationService";
import useTranslation from "next-translate/useTranslation";
import styles from "./styles.module.scss";

export default function DashboardInvite() {
  const { t } = useTranslation("common");
  const { NotificationsService } = useNotificationService();
  const { voucherUrl } = useUserAccount();

  function handleCopy() {
    navigator.clipboard.writeText(voucherUrl);
    NotificationsService.success({
      title: t("copy_base_title"),
      message: t("copy_url"),
    });
  }

  return (
    <div className={styles.card}>
      <div className={styles.card__content}>
        <h2 className={styles.card__content__title}>{t("invite_title")}</h2>
        <div className={styles.card__content__input}>
          <Input
            value={voucherUrl}
            readOnly
            hasPaddingLeft={false}
            hideLock
            className={styles.card__content__input}
            customIcon={
              <Button
                className={styles.card__button}
                useMaxContent
                onClick={handleCopy}
              >
                {t("copy")}
              </Button>
            }
          />
        </div>
      </div>
      <img
        className={styles.card__image}
        src="/donut/assets/refer.png"
        alt="Invite"
      />
    </div>
  );
}
