export interface UseCountdownProps {
  targetDate: string
  disabled?: boolean
  onCountdownComplete?: (countdown: {
    days: string
    hours: string
    minutes: string
    seconds: string
  }) => void
}
