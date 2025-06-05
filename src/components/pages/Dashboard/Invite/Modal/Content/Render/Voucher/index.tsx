import { FormGroup } from "@/components/core/FormGroup"
import { Input } from "@/components/core/Input"
import useTranslation from "next-translate/useTranslation"
import { useFormContext } from "react-hook-form"

export default function DashboardInviteModalContentRenderVoucher() {
  const { t } = useTranslation("common")
  const { register } = useFormContext()

  return (
    <>
      <FormGroup
        label={t("voucher")}
        description={t("voucher_description")}
      >
        <Input
          placeholder={t("voucher")}
          register={register}
          name="voucher"
        />
      </FormGroup>
    </>
  )
}
