import { FormProvider, useForm } from "react-hook-form"
import styles from "./styles.module.scss"
import useTranslation from "next-translate/useTranslation"
import { Button } from "@/components/core/Button"
import DashboardInviteModalContentRender from "./Render"
import { useVoucherForm } from "@/hooks/voucher/useVoucherForm"
import { CreateVoucherDto } from "@/dto/referral-voucher/create-referral-voucher-input.dto"
import { CreateWalletEmailInputDto } from "@/dto/wallet-emails/create-wallet-emails-input.dto"
import { VerifyMfaChallengeDto } from "@/dto/mfa"
import { ErrorCard } from "@/components/core/ErrorCard"

export default function DashboardInviteModalContent() {
  const { t } = useTranslation("common")
  const methods = useForm<
    | CreateVoucherDto
    | CreateWalletEmailInputDto
    | VerifyMfaChallengeDto
  >()
  const { onSubmit, isSubmitting, isPending, error, handleError } =
    useVoucherForm()

  const { handleSubmit } = methods

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorCard error={error} refetch={handleError} />
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <form
        className={styles.container}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.container__content}>
          <DashboardInviteModalContentRender />
        </div>
        <Button
          disabled={isSubmitting}
          type="submit"
          isSkeleton={isPending}
        >
          {t("create")}
        </Button>
      </form>
    </FormProvider>
  )
}
