import { ErrorCardProps } from "./props";
import styles from "./styles.module.scss";
import { Button } from "../Button";
import useTranslation from "next-translate/useTranslation";

/**
 * ErrorCard Component
 * Displays an error message card with optional error details and retry button
 *
 * @component
 * @param {Object} props - Component props
 * @param {Error} [props.error] - Error object containing response data
 * @param {Function} props.refetch - Callback function to retry the failed operation
 * @param {string} [props.customBackground] - Custom background color for the card
 * @param {boolean} [props.isDefaultColor] - Whether to use default color styling
 * @returns {JSX.Element} Error card with message, optional error details and retry button
 */
export function ErrorCard({
  error,
  refetch,
  customBackground,
  isDefaultColor,
}: ErrorCardProps) {
  const { t } = useTranslation("common");

  return (
    <div
      className={`${styles.container} ${
        isDefaultColor ? styles["container--default-color"] : ""
      }`}
      style={{
        backgroundColor: customBackground,
      }}
    >
      <div className={styles.container__spacer} />

      <div
        className={`${styles.container__row} ${styles["container__row--around"]}`}
      >
        <div className={styles.container__swoosh}>
          <i className="fad fa-exclamation-triangle" />
        </div>
        <h6 className={styles.container__title}>{t("error_title")}</h6>
      </div>

      <div className={styles.container__spacer} />

      <p className={styles.container__description}>{t("error_description")}</p>

      <div className={styles.container__spacer} />

      {error && (
        <>
          <div className={styles.container__row}>
            <div className={styles.container__code}>
              {error?.response?.data?.statusCode}
            </div>
            <div className={styles.container__divider} />
            <div className={styles.container__message}>
              {error?.response?.data?.message}
            </div>
          </div>

          <div className={styles.container__spacer} />
        </>
      )}

      <Button
        className={styles.container__button}
        onClick={refetch}
        type="button"
      >
        {t("error_button")}
      </Button>
    </div>
  );
}
