import { ResendCodeButton } from "@/components/core/ResendCodeButton"
import { ValidateCodeInput } from "@/components/core/ValidateCodeInput"
import styles from "../styles.module.scss"

export function UserPhoneNumberFormVerifySkeleton() {
  return (
    <div className={styles.container}>
      <ValidateCodeInput setValue={() => {}} isLoading />
      <ResendCodeButton onClick={() => {}} isSkeleton />
    </div>
  )
}
