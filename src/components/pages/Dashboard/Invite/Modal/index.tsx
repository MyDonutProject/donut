import { ModalLayout } from "@/components/core/Modal/Layout"
import { ModalsKey } from "@/enums/modalsKey"
import useTranslation from "next-translate/useTranslation"
import DashboardInviteModalContent from "./Content"

export default function DashboardInviteModal() {
  const { t } = useTranslation("common")

  return (
    <ModalLayout
      title={t("create_voucher_title")}
      modal={ModalsKey.CreateVoucher}
    >
      <DashboardInviteModalContent />
    </ModalLayout>
  )
}
