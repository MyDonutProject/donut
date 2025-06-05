import styles from "../styles.module.scss"
import { DashboardInviteCardProps } from "./props"

export default function DashboardInviteCard({
  children,
  title,
}: DashboardInviteCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.card__content}>
        <h2 className={styles.card__content__title}>{title}</h2>
        {children}
        <img
          className={styles.card__image}
          src="/donut/assets/refer.png"
          alt="Invite"
        />
      </div>
    </div>
  )
}
