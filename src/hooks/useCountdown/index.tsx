import { useCallback, useEffect, useState } from "react"
import { UseCountdownProps } from "./props"

/**
 * Custom hook to manage a countdown timer.
 * This hook calculates the time left until a target date and provides progress and formatted time.
 *
 * @param {UseCountdownProps} props - The properties for the countdown hook.
 * @param {boolean} props.disabled - Boolean to disable the countdown.
 * @param {string | Date} props.targetDate - The target date for the countdown.
 * @param {Function} [props.onCountdownComplete] - Callback function to be called when the countdown completes.
 *
 * @returns {Object} - An object containing the time left, progress, formatted time, and counting status.
 *
 * Example usage:
 * const { days, hours, minutes, seconds, progress, formattedTimeLeft, isCounting } = useCountdown({
 *   disabled: false,
 *   targetDate: '2023-12-31T23:59:59',
 *   onCountdownComplete: () => function('Countdown complete!'),
 * });
 */
export function useCountdown({
  disabled,
  targetDate,
  onCountdownComplete,
}: UseCountdownProps) {
  /**
   * Function to calculate the time left until the target date.
   * It also checks if the countdown is complete and calls the onCountdownComplete callback if necessary.
   *
   * @param {Function} [clearTimer] - Optional function to clear the timer.
   * @returns {Object} - An object containing days, hours, minutes, seconds, and total time left in milliseconds.
   */
  const calculateTimeLeft = useCallback(
    (clearTimer?: () => void) => {
      const now = new Date().getTime()
      const targetTime = new Date(targetDate).getTime()
      const timeLeft = targetTime - now

      let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
        .toString()
        .padStart(2, "0")
      let hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
        .toString()
        .padStart(2, "0")
      let minutes = Math.floor(
        (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
      )
        .toString()
        .padStart(2, "0")
      let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0")

      if (
        Number(days) <= 0 &&
        Number(hours) <= 0 &&
        Number(minutes) <= 0 &&
        Number(seconds) <= 0
      ) {
        days = "00"
        hours = "00"
        minutes = "00"
        seconds = "00"

        clearTimer?.()

        if (onCountdownComplete || !disabled) {
          onCountdownComplete?.({ days, hours, minutes, seconds })
        }
      }

      return {
        days,
        hours,
        minutes,
        seconds,
        timeLeft,
      }
    },
    [targetDate]
  )

  // State to store the time left until the target date
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft())
  // State to store the progress of the countdown as a percentage
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (disabled) return

    const totalDuration =
      new Date(targetDate).getTime() - new Date().getTime()

    const timer = setInterval(() => {
      const { timeLeft: currentTimeLeft } = calculateTimeLeft(() =>
        clearInterval(timer)
      )
      setTimeLeft(calculateTimeLeft(() => clearInterval(timer)))

      const calculatedProgress =
        ((totalDuration - currentTimeLeft) / totalDuration) * 100
      setProgress(calculatedProgress)
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [disabled, calculateTimeLeft, targetDate])

  return {
    ...timeLeft,
    progress,
    formattedTimeLeft:
      disabled ||
      typeof window == "undefined" ||
      isNaN(Number(timeLeft?.hours))
        ? ""
        : `${timeLeft?.days != "00" ? `${timeLeft?.days}:` : ""}${
            timeLeft?.hours
          }:${timeLeft?.minutes}:${timeLeft?.seconds}`,
    isCounting:
      timeLeft?.days != "00" ||
      timeLeft?.hours != "00" ||
      timeLeft?.minutes != "00" ||
      timeLeft?.seconds != "00",
  }
}

export type { UseCountdownProps }
