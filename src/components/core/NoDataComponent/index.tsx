import useTranslation from "next-translate/useTranslation";
import { NoDataComponentProps } from "./props";
import styles from "./styles.module.scss";

/**
 * NoDataComponent
 * A component that displays a "no data" message with an animated Lottie illustration.
 * Uses translations for text content and supports different styling variants.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} [props.isSecondaryStyles] - Whether to use secondary styling variant
 * @param {boolean} [props.isSmall] - Whether to use smaller size variant
 * @param {boolean} [props.tableStyles] - Whether to use table-specific styling
 * @returns {JSX.Element} The rendered no data message with animation
 *
 * @example
 * // Basic usage
 * <NoDataComponent />
 *
 * // With styling variants
 * <NoDataComponent
 *   isSecondaryStyles={true}
 *   isSmall={true}
 *   tableStyles={false}
 * />
 */
export function NoDataComponent({
  isSecondaryStyles,
  isSmall,
  tableStyles,
}: NoDataComponentProps) {
  const { t } = useTranslation("common");

  // Initialize Lottie animation player with empty search animation

  return (
    <div
      className={`${styles.container} ${
        isSecondaryStyles ? styles["container--secondary-styles"] : ""
      } ${isSmall ? styles["container--small"] : ""} ${
        tableStyles ? styles["container--table"] : ""
      }`}
    >
      <img
        className={styles.container__lottie}
        src="/donut/assets/no-data.png"
      />
      <div className={styles.container__wrapper}>
        <h6 className={styles.container__title}>{t("no_data_title")}</h6>
        <p className={styles.container__description}>{t("no_data_found")}</p>
      </div>
    </div>
  );
}
