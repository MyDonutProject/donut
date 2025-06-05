import { Tooltip } from "@mui/material"
import { ActionButtonProps } from "./props"
import styles from "./styles.module.scss"

export function ActionButton({
  icon,
  tooltipTitle,
  isLoading,
  ...props
}: ActionButtonProps) {
  return (
    <Tooltip title={tooltipTitle} open={!isLoading}>
      <button
        className={styles.button}
        {...props}
        disabled={isLoading}
        type="button"
      >
        <i
          className={isLoading ? "fas fa-circle-notch fa-spin" : icon}
        />
      </button>
    </Tooltip>
  )
}
