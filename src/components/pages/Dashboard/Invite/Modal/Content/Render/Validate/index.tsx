import { ErrorCard } from "@/components/core/ErrorCard"
import MfaModalContent from "@/components/core/MFA/Content"
import { VerifyMfaChallengeDto } from "@/dto/mfa"
import { CreateVoucherDto } from "@/dto/referral-voucher/create-referral-voucher-input.dto"
import { CreateWalletEmailInputDto } from "@/dto/wallet-emails/create-wallet-emails-input.dto"
import { useVoucherForm } from "@/hooks/voucher/useVoucherForm"
import { useFormContext } from "react-hook-form"

export default function DashboardInviteModalContentRenderValidate() {
  const {
    mfaChallengeByIdQuery: { challenge, isPending, error, refetch },
  } = useVoucherForm({ enabled: false })
  const { setValue } = useFormContext<
    | CreateVoucherDto
    | CreateWalletEmailInputDto
    | VerifyMfaChallengeDto
  >()

  function handleCodeChanged(code: string) {
    setValue("code", code)
  }

  if (error) {
    return <ErrorCard error={error} refetch={refetch} />
  }

  return (
    <MfaModalContent
      onCodeChanged={handleCodeChanged}
      challenge={challenge}
      isPending={isPending}
    />
  )
}
