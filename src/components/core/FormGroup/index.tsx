import { JSX, PropsWithChildren } from "react";
import styles from "./styles.module.scss";
import { FormGroupProps } from "./props";
import useTranslation from "next-translate/useTranslation";
import FormGroupSkeletonLabel from "./Skeleton/Label";
import FormGroupSkeletonDescription from "./Skeleton/Description";
import { ErrorChip } from "../ErrorChip";
/**
 * FormGroup Component
 * A form group component that wraps form elements with optional label, description and loading states
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.label] - Label text for the form group
 * @param {ReactNode} props.children - Child elements to render inside form group
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.description] - Description text below label
 * @param {boolean} [props.loading] - Loading state for skeleton components
 * @param {boolean} [props.isLoading] - Whether to show loading skeleton state
 * @param {boolean} [props.optional] - Whether to show optional label text
 * @param {boolean} [props.alignCenter] - Whether to center align content
 * @param {ReactNode} [props.action] - Action element to show next to label
 * @param {Error} [props.error] - Error object to show error state
 * @param {Function} [props.refetch] - Callback function for error retry
 * @returns {JSX.Element} Form group component with label, description and children
 */
export function FormGroup({
  label,
  children,
  className = "",
  description,
  loading,
  isLoading,
  optional,
  optionalLabel,
  alignCenter,
  action,
  error,
  refetch,
  secondary,
}: PropsWithChildren<FormGroupProps>): JSX.Element {
  const { t } = useTranslation("common");

  if (error) {
    return <ErrorChip action={refetch} />;
  }

  return (
    <div
      className={`${styles.container} ${
        alignCenter ? styles["container--align-center"] : ""
      } ${className}`}
    >
      {isLoading ? (
        <FormGroupSkeletonLabel loading={loading} />
      ) : (
        label && (
          <label
            className={`${styles.container__label} ${
              action ? styles["container__label--action"] : ""
            } ${secondary ? styles["container__label--secondary"] : ""}`}
          >
            {label} {action ? action : null}
            {optional && !optionalLabel && (
              <span
                className={`${styles.container__label} ${styles["container__label--secondary"]}`}
              >
                ({t("optional_label")})
              </span>
            )}
            {optional && optionalLabel && (
              <span
                className={`${styles.container__label} ${styles["container__label--secondary"]}`}
              >
                {optionalLabel}
              </span>
            )}
          </label>
        )
      )}
      {isLoading ? (
        <FormGroupSkeletonDescription loading={loading} />
      ) : (
        description && (
          <label className={styles["container__description"]}>
            {description}
          </label>
        )
      )}
      {children}
    </div>
  );
}
