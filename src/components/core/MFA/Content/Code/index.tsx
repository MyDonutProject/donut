import { MfaModalProps } from "@/components/core/MFA/Content/props"
import styles from "@/components/core/MFA/Content/Code/styles.module.scss"
import { ValidateCodeInput } from "@/components/core/ValidateCodeInput"
import { ResendCodeButton } from "@/components/core/ResendCodeButton"

export default function CodeMfaModalContentCode({
  isContainerColor,
  onCodeChanged,
  onCodeResend,
  isPending,
}: MfaModalProps) {
  /**
   * resendCode Function
   * This function triggers the sending of a verification code to the user's email.
   * It uses the emailId from the form context to identify the user.
   *
   * @example
   * resendCode(); // Sends a verification code to the email associated with the current emailId
   */
  function resendCode() {
    onCodeResend()
  }

  /**
   * onChange Function
   * This function updates the form context with the new verification code value.
   *
   * @param {string} value - The new value for the verification code.
   *
   * @example
   * onChange('123456'); // Sets the verification code in the form context to '123456'
   */
  function onChange(value: string) {
    onCodeChanged(value)
  }

  return (
    <div className={styles.container}>
      <ValidateCodeInput
        setValue={onChange}
        isContainerColor={isContainerColor}
      />
      {!!onCodeChanged && (
        <ResendCodeButton
          onClick={resendCode}
          isLoading={isPending}
        />
      )}
    </div>
  )
}
