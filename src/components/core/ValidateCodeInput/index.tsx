import { useCallback, useEffect, useRef } from "react"
import { ValidateCodeInputProps } from "./props"
import styles from "./styles.module.scss"
import { KeyboardKey } from "@/enums/keyboardKey"

/**
 * ValidateCodeInput component is responsible for rendering a series of input fields
 * that allow users to enter a code. It handles user interactions such as typing,
 * pasting, and navigating between inputs using arrow keys.
 *
 * @param {ValidateCodeInputProps} props - The properties for the component.
 * @param {Function} props.setValue - A function to set the value of the code entered.
 * @param {number} [props.maxLength=6] - The maximum length of the code.
 * @param {boolean} props.isContainerColor - Flag to apply container color style.
 * @param {boolean} props.isLoading - Flag to indicate loading state.
 * @param {boolean} props.withMaxWidth - Flag to apply max width style.
 * @param {boolean} props.isDefaultColor - Flag to apply default color style.
 * @param {boolean} props.notAutoSelect - Flag to disable auto-focus on first input.
 *
 * @returns {JSX.Element} The rendered component.
 */
export function ValidateCodeInput({
  setValue,
  maxLength = 6,
  isContainerColor,
  isLoading,
  withMaxWidth,
  isDefaultColor,
  preventAutoFocus,
}: ValidateCodeInputProps) {
  // Ref to store references to input elements
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Effect to ensure inputRefs array matches the maxLength
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, maxLength)
  }, [maxLength])

  /**
   * handleSetValue is a callback function that aggregates the values from all input fields
   * and sets the combined value using the setValue function.
   */
  const handleSetValue = useCallback(() => {
    const value = inputRefs.current
      .map((input) => input?.value ?? "")
      .filter((value) => value !== "")
      .join("")

    setValue(value)
  }, [setValue])

  /**
   * handleArrowLeft moves the focus to the previous input field when the left arrow key is pressed.
   *
   * @param {any} e - The event object from the keydown event.
   */
  function handleArrowLeft(e: any) {
    const previousInput = e.target
      .previousElementSibling as HTMLInputElement
    if (!previousInput) return
    setTimeout(() => {
      previousInput.selectionStart = previousInput.selectionEnd =
        previousInput.value.length
      previousInput.focus()
    }, 0)
  }

  /**
   * handleArrowRight moves the focus to the next input field when the right arrow key is pressed.
   *
   * @param {any} e - The event object from the keydown event.
   */
  function handleArrowRight(e: any) {
    const nextInput = e.target.nextElementSibling as HTMLInputElement
    if (!nextInput) return
    nextInput.focus()
  }

  /**
   * handleChange processes the input change event, ensuring only numeric values are entered,
   * and moves focus to the next input if applicable.
   *
   * @param {any} e - The event object from the change event.
   */
  function handleChange(e: any) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "")

    handleSetValue()

    if (
      Object.values(KeyboardKey).includes(e?.code) ||
      !e.target.value
    ) {
      return
    }

    handleArrowRight(e)
  }

  /**
   * handleBackspace moves the focus to the previous input field if the current input is empty
   * and the backspace key is pressed.
   *
   * @param {any} e - The event object from the keydown event.
   */
  function handleBackspace(e: any) {
    const input = e.target

    if (input.value !== "") {
      return
    }

    if (!input?.previousElementSibling) return
    input.previousElementSibling.focus()
  }

  /**
   * handlePaste is a callback function that handles the paste event, ensuring only numeric
   * values are pasted into the input fields.
   *
   * @param {any} e - The event object from the paste event.
   */
  const handlePaste = useCallback(
    (e: any) => {
      e.preventDefault()
      const paste = e.clipboardData
        .getData("text")
        ?.replace(/[^0-9]/g, "")
      inputRefs.current.forEach((input, i) => {
        if (!input) {
          return
        }

        input.value = paste[i] || ""
      })

      handleSetValue()
    },
    [handleSetValue]
  )

  /**
   * handleMount sets up event listeners for paste and keydown events on the input fields
   * and ensures the first input is focused if none are focused and preventAutoFocus is false.
   */
  function handleMount() {
    if (
      typeof window == "undefined" ||
      typeof document == "undefined"
    ) {
      return
    }

    const hasSomeInputFocused = inputRefs.current?.some(
      (ref) => ref == document.activeElement
    )

    inputRefs.current.forEach((input, index) => {
      if (index == 0 && !hasSomeInputFocused && !preventAutoFocus) {
        input?.focus()
      }

      input?.addEventListener("paste", handlePaste)
      input?.addEventListener("keydown", (e) => {
        switch (e.code) {
          case KeyboardKey.BACKSPACE:
            handleBackspace(e)
            break
          case KeyboardKey.ARROW_LEFT:
            handleArrowLeft(e)
            break
          case KeyboardKey.ARROW_RIGHT:
            handleArrowRight(e)
            break
          default:
        }
      })
    })
  }

  // Effect to handle component mount logic
  useEffect(handleMount, [handlePaste, inputRefs, preventAutoFocus])

  // Render loading skeleton if isLoading is true
  if (isLoading) {
    return (
      <div
        className={styles.container}
        style={{
          gridTemplateColumns: `repeat(${maxLength}, auto)`,
        }}
      >
        {Array.from({ length: maxLength }).map((_, index) => (
          <div
            key={index}
            className={`${styles.container__input__skeleton} ${
              withMaxWidth
                ? styles["container__input--max-width"]
                : ""
            }`}
          />
        ))}
      </div>
    )
  }

  // Render input fields for code entry
  return (
    <div
      className={styles.container}
      style={{
        gridTemplateColumns: `repeat(${maxLength}, auto)`,
      }}
    >
      {Array.from({ length: maxLength }).map((_, index) => (
        <input
          key={index}
          type="text"
          className={`${styles.container__input} ${
            isContainerColor
              ? styles["container__input--container-color"]
              : ""
          } ${
            isDefaultColor
              ? styles["container__input--default-color"]
              : ""
          } ${
            withMaxWidth ? styles["container__input--max-width"] : ""
          }`}
          onChange={handleChange}
          maxLength={1}
          //@ts-ignore
          ref={(el) => (inputRefs.current[index] = el)}
        />
      ))}
    </div>
  )
}
