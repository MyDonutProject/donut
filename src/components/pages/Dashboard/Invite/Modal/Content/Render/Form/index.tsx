import { FormGroup } from "@/components/core/FormGroup"
import { Input } from "@/components/core/Input"
import { CreateVoucherDto } from "@/dto/referral-voucher/create-referral-voucher-input.dto"
import { CreateWalletEmailInputDto } from "@/dto/wallet-emails/create-wallet-emails-input.dto"
import { useVoucherForm } from "@/hooks/voucher/useVoucherForm"
import useTranslation from "next-translate/useTranslation"
import { useFormContext } from "react-hook-form"

export default function DashboardInviteModalContentRenderForm() {
  const { t } = useTranslation("common")
  const { register } = useFormContext<
    CreateVoucherDto | CreateWalletEmailInputDto
  >()
  const { isPending } = useVoucherForm({ enabled: false })

  return (
    <>
      <FormGroup
        isLoading={isPending}
        loading={{
          label: true,
          description: true,
          secondary: true,
        }}
        label={t("email")}
        description={t("email_description")}
      >
        <Input
          placeholder={t("email")}
          register={register}
          name="email"
          isLoading={isPending}
        />
      </FormGroup>
    </>
  )
}
