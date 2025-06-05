import { useEffect, useMemo, useState } from "react"
import styles from "./styles.module.scss"
import { ResendCodeButtonProps } from "./props"
import useTranslation from "next-translate/useTranslation"

/**
 * ResendCodeButton Component
 * A button component that handles resending verification codes with a countdown timer.
 * The button becomes disabled for 60 seconds after a successful code resend.
 *
 * @component
 * @param {Object} props - Component props
 * @param {() => void} props.onClick - Callback function when button is clicked
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {boolean} props.isSuccess - Whether the last resend attempt was successful
 * @param {boolean} props.isSkeleton - Whether to show a skeleton loading state
 * @returns {JSX.Element} Button component with countdown timer
 *
 * @example
 * <ResendCodeButton
 *   onClick={() => handleResendCode()}
 *   isLoading={false}
 *   isSuccess={false}
 *   isSkeleton={false}
 * />
 */
export function ResendCodeButton({
  onClick,
  isLoading,
  isSuccess,
  isSkeleton,
}: ResendCodeButtonProps) {
  const { t } = useTranslation("common")

  // State to track when SMS was last sent (initialized to 60s from now)
  const [smsSendAt, setSmsSendAt] = useState(
    new Date(new Date().getTime() + 60000)
  )

  // State to track current time for countdown
  const [currentDate, setCurrentDate] = useState(new Date())

  // Disable button if countdown not finished
  const isButtonDisabled: boolean = smsSendAt > currentDate

  // Calculate remaining seconds in countdown
  const difference: number = useMemo(
    () =>
      (smsSendAt &&
        Math.trunc(
          Math.abs(
            ((smsSendAt as Date).getTime() -
              currentDate.getTime()) as number
          ) / 1000
        )) ||
      0,
    [smsSendAt, currentDate]
  )

  /**
   * Handles successful resend by resetting countdown timer
   * Called when isSuccess prop changes
   */
  function onSuccess() {
    if (!isSuccess) {
      return
    }

    setSmsSendAt(new Date(new Date().getTime() + 60000))
  }

  useEffect(onSuccess, [isSuccess])

  /**
   * Sets up interval to update current time every second
   * Cleans up interval on unmount
   * @returns {() => void} Cleanup function to clear interval
   */
  function onMount() {
    let intervalId: NodeJS.Timeout

    intervalId = setInterval(() => setCurrentDate(new Date()), 1000)

    return () => {
      clearInterval(intervalId)
    }
  }

  useEffect(onMount, [])

  if (isSkeleton) {
    return <div className={styles.skeleton} />
  }

  return (
    <button
      className={styles.button}
      disabled={isButtonDisabled || isLoading}
      onClick={onClick}
      type="button"
    >
      {t("resend_code")}{" "}
      {isButtonDisabled
        ? `- ${difference > 60 ? 60 : difference}`
        : ""}
    </button>
  )
}
