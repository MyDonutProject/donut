import { ActionButton } from "@/components/core/TableGrid/ActionButton"
import { ModalsKey } from "@/enums/modalsKey"
import { VoucherStep } from "@/hooks/voucher/useVoucherForm/props"
import { WalletEmail } from "@/models/wallet/emails"
import { Switch } from "@mui/material"
import useTranslation from "next-translate/useTranslation"
import { useRouter } from "next/router"

export default function DashboardVerifiedCell({
  email,
}: {
  email: WalletEmail
}) {
  const { t } = useTranslation("common")
  const { push, query } = useRouter()

  function handleRedirect() {
    push({
      query: {
        ...query,
        step: VoucherStep.Validate,
      },
      hash: ModalsKey.CreateVoucher,
    })
  }

  if (email.verified) {
    return (
      <div>
        <Switch checked={email.verified} readOnly disabled />
      </div>
    )
  }

  return (
    <ActionButton
      icon="fa-solid fa-check"
      tooltipTitle={t("verify_email")}
      onClick={handleRedirect}
    />
  )
}
