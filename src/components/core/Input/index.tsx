/* eslint-disable react/no-danger */
import { useToggle } from "@/hooks/useToggle";
import { fixedForwardRef } from "@/utils/forward-ref";
import { FocusEvent, ForwardedRef, useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { InputProps } from "./props";
import styles from "./styles.module.scss";
/**
 * Input Component
 * A highly customizable input component that supports various input types including text, password, checkbox, radio, switch, range and textarea.
 * Includes features like error states, loading states, icons, and form integration with react-hook-form.
 *
 * @component
 * @template T - Type extending FieldValues from react-hook-form
 * @param {InputProps<T>} props - Component props
 * @param {boolean} [props.isError=false] - Whether input is in error state
 * @param {boolean} [props.isContainerColor] - Whether to use container background color
 * @param {string|string[]} [props.errorMessage] - Error message(s) to display
 * @param {Function} [props.onFocus] - Focus event handler
 * @param {Function} [props.onBlur] - Blur event handler
 * @param {string} [props.name] - Input name attribute
 * @param {Function} [props.register] - react-hook-form register function
 * @param {string} [props.icon] - Icon class name
 * @param {Object} [props.registerOptions] - react-hook-form register options
 * @param {boolean} [props.showEraserButton] - Whether to show clear button
 * @param {Function} [props.onErase] - Clear button click handler
 * @param {boolean} [props.isLoading] - Whether input is in loading state
 * @param {boolean} [props.readOnly] - Whether input is read-only
 * @param {boolean} [props.hideLock] - Whether to hide lock icon for read-only state
 * @param {boolean} [props.isCardColor] - Whether to use card background color
 * @param {boolean} [props.showSpinner] - Whether to show loading spinner
 * @param {boolean} [props.hasPaddingRight] - Whether to add right padding
 * @param {boolean} [props.hasPaddingLeft] - Whether to add left padding
 * @param {boolean} [props.focusOnMount] - Whether to focus input on mount
 * @param {string} [props.className] - Additional CSS classes
 * @param {ReactNode} [props.customIcon] - Custom icon component
 * @param {string} [props.rightIcon] - Right icon class name
 * @param {string} [props.type] - Input type
 * @param {boolean} [props.useTextArea] - Whether to render as textarea
 * @param {boolean} [props.secondarySkeleton] - Whether to use secondary skeleton style
 * @param {ForwardedRef<HTMLInputElement>} ref - Forwarded ref
 * @returns {JSX.Element} Input component
 *
 * @example
 * // Basic text input with error state
 * <Input<FormData>
 *   name="username"
 *   type="text"
 *   isError={true}
 *   errorMessage="Username is required"
 *   register={register}
 *   placeholder="Enter username"
 * />
 *
 * @example
 * // Password input with icon
 * <Input<FormData>
 *   name="password"
 *   type="password"
 *   icon="fa-lock"
 *   register={register}
 *   placeholder="Enter password"
 * />
 */
function InputComponent<T extends FieldValues>(
  {
    isError = false,
    isContainerColor,
    errorMessage,
    onFocus,
    onBlur,
    name,
    register,
    icon,
    registerOptions = {},
    showEraserButton,
    onErase,
    isLoading = false,
    readOnly,
    hideLock,
    isCardColor,
    showSpinner,
    hasPaddingRight,
    hasPaddingLeft,
    focusOnMount,
    className = "",
    customIcon,
    rightIcon,
    type,
    useTextArea,
    secondarySkeleton = true,
    ...props
  }: InputProps<T>,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);
  const [isEditing, toggleIsEditing] = useToggle(true);
  const [showPassword, toggleShowPassword] = useToggle();
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles input focus event
   * Calls onFocus prop if provided and hides error tooltip
   *
   * @param {FocusEvent} e - Focus event
   */
  function handleFocus(
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) {
    onFocus?.(e);
    setOpenTooltip(false);
  }

  /**
   * Handles input blur event
   * Calls onBlur prop if provided, toggles editing state and shows error tooltip
   *
   * @param {FocusEvent} e - Blur event
   */
  function handleBlur(e: FocusEvent<HTMLInputElement, Element>) {
    onBlur?.(e);
    toggleIsEditing();
    setOpenTooltip(true);
  }

  /**
   * Gets the input type based on type prop
   * Handles special cases for switch and password types
   *
   * @returns {string} HTML input type
   */
  function getType(): string {
    switch (type) {
      case "switch":
        return "checkbox";
      case "password":
        return showPassword ? "text" : "password";
      default:
        return type;
    }
  }

  /**
   * Resets search input value
   * Focuses input and clears value, then calls onErase if provided
   */
  function resetSearchValue(): void {
    if (inputRef?.current) {
      inputRef.current.focus();
      inputRef.current.value = "";
    }

    onErase?.();
  }

  /**
   * Shows error tooltip if input is in error state
   */
  function handleOpenTooltip() {
    if (!isError) {
      return;
    }

    setOpenTooltip(true);
  }

  useEffect(handleOpenTooltip, [isError]);

  /**
   * Focuses input on mount if focusOnMount is true
   */
  function handleMountFocus() {
    if (!focusOnMount || !inputRef?.current) {
      return;
    }

    inputRef.current?.focus();
  }

  useEffect(handleMountFocus, [focusOnMount, inputRef]);

  if (isLoading) {
    return (
      <div
        className={`${styles.skeleton} ${
          secondarySkeleton && !isContainerColor
            ? styles["skeleton--secondary"]
            : styles["skeleton--default"]
        } ${!!type ? styles[`skeleton--${type}`] : ""}`}
      />
    );
  }

  return (
    <div
      className={`${styles.container} ${
        !!type ? styles[`container--${type}`] : ""
      } `}
    >
      <div
        className={`${styles.container__relative} ${
          !!type ? styles[`container__relative--${type}`] : ""
        } ${className}`}
      >
        <input
          readOnly={readOnly}
          className={`${styles.container__input} ${
            !!icon || !!customIcon ? styles["container__input--figure"] : ""
          } ${
            hasPaddingRight ? styles["container__input--figure--right"] : ""
          } ${hasPaddingLeft ? styles["container__input--padding-left"] : ""} ${
            isContainerColor ? styles["container__input--container-color"] : ""
          } ${isCardColor ? styles["container__input--card-color"] : ""} ${
            isError && openTooltip ? styles["container__input--error"] : ""
          } ${!!type ? styles[`container__input--${type}`] : ""}`}
          ref={ref ?? inputRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          spellCheck={false}
          name={name}
          type={getType()}
          style={{
            //@ts-ignore
            "--position":
              type == "range"
                ? `${(Number(props?.value ?? 0) / Number(props?.max)) * 100}%`
                : undefined,
          }}
          {...props}
          {...(register &&
            name &&
            register?.(name, {
              ...registerOptions,
              onBlur: (e) => {
                registerOptions?.onBlur?.(e);
                handleBlur(e);
              },
            }))}
        />
        {["checkbox", "radio"].includes(type as string) && (
          <span
            className={`${styles.container__input__checkmark} ${
              type == "radio"
                ? styles["container__input__checkmark--radio"]
                : ""
            }`}
          />
        )}
        {type == "switch" && (
          <span className={styles.container__input__switch__slider} />
        )}
        {type == "range" && (
          <div
            className={styles.container__input__indicator}
            style={{
              //@ts-ignore
              "--indicator-position": `${
                (Number(props?.value ?? 0) / Number(props?.max)) * 100
              }%`,
            }}
          >
            {props?.value}
          </div>
        )}
        {icon && !showSpinner && (
          <i
            className={`${styles.container__figure} ${
              hasPaddingRight ? styles["container__figure--right"] : ""
            } ${icon}`}
          />
        )}

        {customIcon && !showSpinner && customIcon}

        {showEraserButton && (icon ? true : !showSpinner) && (
          <button
            className={styles.container__eraser}
            onClick={resetSearchValue}
            type="button"
          >
            <i className="fa-solid fa-xmark-large" />
          </button>
        )}

        {(readOnly || props?.disabled) &&
          !hideLock &&
          !["checkbox", "radio"].includes(type as string) && (
            <i
              className={`${styles.container__figure} ${
                styles["container__figure--right"]
              } fa-solid fa-lock ${
                !!type ? styles[`container__figure--${type}`] : ""
              }`}
            />
          )}
        {rightIcon && !hideLock && (
          <i
            className={`${styles.container__figure} ${styles["container__figure--right"]}  ${rightIcon}`}
          />
        )}

        {type === "password" && !icon && !rightIcon && (
          <i
            className={`${styles.container__figure} ${
              styles["container__figure--right"]
            } ${styles["container__figure--password"]} ${
              showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
            }`}
            onClick={toggleShowPassword}
          />
        )}

        {showSpinner && (
          <div
            className={`${styles.container__figure} ${
              !icon ? styles["container__figure--right"] : ""
            }`}
          >
            <i className="fas fa-circle-notch fa-spin" />
          </div>
        )}
      </div>

      {isError &&
        openTooltip &&
        !!errorMessage &&
        (Array.isArray(errorMessage) ? (
          errorMessage.map((error, i) => (
            <span
              className={styles["container__input-error"]}
              key={`error-message-${i}`}
            >
              *{error}
            </span>
          ))
        ) : (
          <span className={styles["container__input-error"]}>
            *{errorMessage}
          </span>
        ))}

      {type == "range" && (
        <>
          <div className={styles.container__value}>{props?.value}</div>
          <div
            className={`${styles.container__value} ${styles["container__value--right"]}`}
          >
            {props?.max}
          </div>
        </>
      )}
    </div>
  );
}

export const Input = fixedForwardRef(InputComponent);
