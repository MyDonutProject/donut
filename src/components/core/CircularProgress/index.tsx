import Color from "color"
import { CircularProgressProps } from "./props"
import styles from "./styles.module.scss"
import { PropsWithChildren } from "react"

export default function CircularProgress({
  progress,
  pathColor,
  trailColor,
  children,
}: PropsWithChildren<CircularProgressProps>) {
  const style = getComputedStyle(document.body)
  const primaryColor = style
    .getPropertyValue("--primary-color")
    .trimEnd()
    .trimStart()

  return (
    <div
      className={styles.container}
      style={{
        background: `conic-gradient(
          ${
            trailColor
              ? trailColor
              : Color(primaryColor).alpha(0.5).toString()
          }  ${progress}%, 0, ${
          pathColor ? pathColor : primaryColor
        }  ${100 - Math.ceil(progress)}%
        )
     `,
      }}
    >
      {children}
    </div>
  )
}
