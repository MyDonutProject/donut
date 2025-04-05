import useTranslation from "next-translate/useTranslation";
import { Button } from "../../Button";
import CloseButton from "./CloseButton";
import { ModalHeaderProps } from "./props";
import styles from "./styles.module.scss";

/**
 * ModalHeader Component
 * A reusable header component for modals that can include a title, close button, and back button.
 * Supports loading states, various padding options, and customizable visibility of buttons.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The title text to display in the header
 * @param {() => void} props.onClose - Callback function when close button is clicked
 * @param {string} [props.className=''] - Additional CSS class names to apply
 * @param {boolean} [props.isLoading] - Whether to show loading skeleton instead of title
 * @param {() => void} [props.handleGoBack] - Callback function when back button is clicked
 * @param {boolean} [props.smallPadding] - Whether to use smaller padding
 * @param {boolean} [props.withBackButton] - Whether to show the back button
 * @param {boolean} [props.withoutPadding] - Whether to remove padding completely
 * @param {boolean} [props.hideCloseButton] - Whether to hide the close button
 * @param {boolean} [props.smallMobilePadding] - Whether to use smaller padding on mobile
 * @returns {JSX.Element} The rendered modal header
 *
 * @example
 * // Basic usage with title and close handler
 * <ModalHeader
 *   title="My Modal"
 *   onClose={() => setIsOpen(false)}
 * />
 *
 * // With back button and loading state
 * <ModalHeader
 *   title="Details"
 *   onClose={() => setIsOpen(false)}
 *   isLoading={isLoading}
 *   withBackButton
 *   handleGoBack={() => navigate(-1)}
 *   smallPadding
 * />
 */
export function ModalHeader({
  title,
  onClose,
  className = "",
  isLoading,
  handleGoBack,
  smallPadding,
  withBackButton,
  withoutPadding,
  hideCloseButton,
  smallMobilePadding,
  version,
  invertColor,
}: ModalHeaderProps) {
  const { t } = useTranslation("common");

  /**
   * Handles the back button click event
   * Calls the handleGoBack callback if provided
   */
  function onGoBack() {
    if (handleGoBack) {
      handleGoBack();
      return;
    }
  }

  return (
    <div
      className={`${styles.container} ${
        withoutPadding ? styles["container--no-padding"] : ""
      } ${
        smallMobilePadding ? styles["container--small-mobile-padding"] : ""
      } ${smallPadding ? styles["container--small-padding"] : ""} ${
        invertColor ? styles["container--invert-color"] : ""
      } ${className}`}
    >
      {withBackButton && (
        <Button
          type="button"
          isTiny
          onClick={onGoBack}
          isSecondary
          useMaxContent
          className={styles["container__back-button"]}
        >
          <i className="fa-solid fa-arrow-left" />
          <span>{t("back_button")}</span>
        </Button>
      )}

      {isLoading ? (
        <div className={styles["title-skeleton"]} />
      ) : (
        <h3 className={styles.container__title}>{title}</h3>
      )}

      {!hideCloseButton && (
        <div className={styles.container__close}>
          <CloseButton onClick={onClose} />
        </div>
      )}
    </div>
  );
}
