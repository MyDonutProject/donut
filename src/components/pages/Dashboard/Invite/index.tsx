import { useUserAccount } from "@/api/account"
import { Button } from "@/components/core/Button"
import { Input } from "@/components/core/Input"
import { useNotificationService } from "@/hooks/notifications/useNotificationService"
import useTranslation from "next-translate/useTranslation"
import styles from "./styles.module.scss"
import DashboardInviteCard from "./Card"
import { useRouter } from "next/router"
import { ModalsKey } from "@/enums/modalsKey"

export default function DashboardInvite() {
  const { t } = useTranslation("common")
  const { NotificationsService } = useNotificationService()
  const { voucherUrl } = useUserAccount()
  const { push } = useRouter()
  let hasVoucherUrl = false

  function handleCopy() {
    if (!hasVoucherUrl) {
      push({
        hash: ModalsKey.CreateVoucher,
      })
      return
    }
    navigator.clipboard.writeText(voucherUrl)
    NotificationsService.success({
      title: t("copy_base_title"),
      message: t("copy_url"),
    })
  }

  if (!hasVoucherUrl) {
    return (
      <DashboardInviteCard title={t("create_voucher_title")}>
        <Button isSecondary useMaxContent onClick={handleCopy}>
          {t("create")}
        </Button>
      </DashboardInviteCard>
    )
  }

  return (
    <DashboardInviteCard title={t("invite_title")}>
      <Input
        value={voucherUrl}
        readOnly
        hasPaddingLeft={false}
        hideLock
        className={styles.card__content__input}
        customIcon={
          <Button
            className={styles.card__button}
            useMaxContent
            onClick={handleCopy}
          >
            {t("copy")}
          </Button>
        }
      />
    </DashboardInviteCard>
  )
}
