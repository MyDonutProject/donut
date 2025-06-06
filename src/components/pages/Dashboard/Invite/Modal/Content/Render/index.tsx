import { VoucherStep } from "@/hooks/voucher/useVoucherForm/props"
import { useVoucherForm } from "@/hooks/voucher/useVoucherForm"
import DashboardInviteModalContentRenderForm from "./Form"
import DashboardInviteModalContentRenderValidate from "./Validate"
import DashboardInviteModalContentRenderVoucher from "./Voucher"

export default function DashboardInviteModalContentRender() {
  const { step } = useVoucherForm({ enabled: false })

  switch (step) {
    // switch (step) {
    case VoucherStep.Form:
      return <DashboardInviteModalContentRenderForm />
    case VoucherStep.Validate:
      return <DashboardInviteModalContentRenderValidate />
    case VoucherStep.Voucher:
      return <DashboardInviteModalContentRenderVoucher />
    default:
      return <DashboardInviteModalContentRenderForm />
  }
}
