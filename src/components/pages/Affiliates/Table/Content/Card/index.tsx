import { useNotificationService } from "@/hooks/notifications/useNotificationService";
import { formatLargeString } from "@/utils/formatLargeString";
import useTranslation from "next-translate/useTranslation";
import { options } from "../../Header/Select/options";
import { AffiliatesCardProps } from "./props";
import styles from "./styles.module.scss";

export default function AffiliatesCard({
  name,
  date,
  rank,
  address,
  position,
}: AffiliatesCardProps) {
  const { t } = useTranslation("common");
  const { NotificationsService } = useNotificationService();

  function handleCopy() {
    navigator.clipboard.writeText(address);
    NotificationsService.success({
      title: t("copy_base_title"),
      message: t("copy_url"),
    });
  }

  return (
    <div className={styles.card}>
      <img
        className={styles.card__image}
        src={`/donut/donuts/${options?.[1]?.image}`}
        alt={options?.[1]?.label}
      />
      <div className={styles.card__column}>
        <div className={styles.card__row}>
          <p className={styles.card__row__title}>
            {formatLargeString(address?.toString() || "")}
            <i className="fa-solid fa-copy" onClick={handleCopy} />
          </p>
        </div>
        <p className={styles.card__row__address}>
          {t("registered_at", {
            date: date.toLocaleDateString(),
          })}
        </p>
      </div>
      <div className={`${styles.card__column} ${styles["card__column--end"]}`}>
        <p className={styles.card__row__title}>{t(options?.[1]?.label)}</p>
        <p className={styles.card__row__position}>#{position}</p>
      </div>
    </div>
  );
}
