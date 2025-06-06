import { useRouter } from "next/router"
import { UseVoucherFormProps, VoucherStep } from "./props"
import { useCallback } from "react"
import { useWalletEmails } from "@/api/wallet-emails"
import { AxiosError } from "axios"
import { GenericError } from "@/models/generic-error"
import { WalletEmail } from "@/models/wallet/emails"
import { ModalsKey } from "@/enums/modalsKey"
import { useMfaChallengeCallbacks } from "@/hooks/mfa"
import { useCreateWalletEmail } from "@/api/wallet-emails/mutations/useCreateWalletEmail"
import { useWallet } from "@solana/wallet-adapter-react"
import { MultiFactorAuthenticationMethodId } from "@/models/multi-factor-authentication/methods/id"
import { MultiFactorAuthenticationReasonId } from "@/models/multi-factor-authentication/reasons/id"
import { MultiFactorAuthenticationChallenge } from "@/models/multi-factor-authentication"
import { VerifyMultiFactorAuthenticationChallengeResult } from "@/models/multi-factor-authentication/challenge/result"
import { useVerifyWalletEmail } from "@/api/wallet-emails/mutations"
import { VerifyMfaChallengeDto } from "@/dto/mfa"
import { Nullable } from "@/interfaces/nullable"
import { useCreateReferralVoucher } from "@/api/referral-vouchers/mutations"
import { useNotificationService } from "@/hooks/notifications/useNotificationService"
import { useModal } from "@/hooks/modal"
import { QueryClient, useQueryClient } from "@tanstack/react-query"
import { ReferralVouchersEmailsQueryKeys } from "@/api/referral-vouchers/queryKeys"
import { useMfaChallengeById } from "@/api/mfa"

export function useVoucherForm(options?: UseVoucherFormProps) {
  const { enabled = true } = options ?? {}
  const { query, push } = useRouter()
  const step = (query?.step as VoucherStep) ?? VoucherStep.Form
  const { wallet } = useWallet()
  const { NotificationsService } = useNotificationService()
  const { onClose } = useModal(ModalsKey.CreateVoucher)
  const queryClient: QueryClient = useQueryClient()

  const {
    handleCreateMfaChallenge,
    handleVerifyMfaChallenge,
    isPending: isSubmittingMfa,
  } = useMfaChallengeCallbacks()
  const {
    createWalletEmailAsync,
    isPending: isSubmittingWalletEmail,
  } = useCreateWalletEmail()
  const {
    verifyWalletEmailAsync,
    isPending: isSubmittingVerifyWalletEmail,
  } = useVerifyWalletEmail()
  const {
    createReferralVoucher,
    isPending: isSubmittingCreateReferralVoucher,
  } = useCreateReferralVoucher()

  const isSubmitting: boolean =
    isSubmittingMfa ||
    isSubmittingWalletEmail ||
    isSubmittingVerifyWalletEmail ||
    isSubmittingCreateReferralVoucher

  const handleChallengeVerifySuccess = useCallback(() => {
    push({
      query: {
        ...query,
        step: VoucherStep.Voucher,
      },
      hash: ModalsKey.CreateVoucher,
    })
  }, [query, push])

  const handleChallengeVerify = useCallback(
    async (
      result: VerifyMultiFactorAuthenticationChallengeResult,
      variables: VerifyMfaChallengeDto
    ) => {
      if (result?.success === false) {
        return
      }

      await verifyWalletEmailAsync(
        {
          emailId: query?.emailId as string,
          code: variables?.code,
          challengeId: variables?.challengeId?.toString(),
        },
        {
          onSuccess: handleChallengeVerifySuccess,
        }
      )
    },
    [query, push, verifyWalletEmailAsync]
  )

  const mfaChallengeByIdQuery = useMfaChallengeById({
    id: query?.challengeId as string,
    onSuccess(challenge) {
      handleChallengeVerifySuccess()
    },
  })

  function handleExternalOnSuccess(data: Nullable<WalletEmail>) {
    if (!data || data?.verified === true) {
      return
    }

    handleCreateMfaChallenge({
      //@ts-ignore
      address: wallet?.adapter?.publicKey?.toBase58() ?? "",
      methodId: MultiFactorAuthenticationMethodId.Email,
      reasonId: MultiFactorAuthenticationReasonId.ConfirmEmail,
    }).then((challenge: MultiFactorAuthenticationChallenge) => {
      push({
        query: {
          ...query,
          step: VoucherStep.Validate,
          email: data?.email,
          emailId: data?.id?.toString(),
          challengeId: challenge?.id?.toString(),
        },
        hash: ModalsKey.CreateVoucher,
      })
    })
  }

  const useUserEmailsQuery = useWalletEmails({
    externalOnSuccess: handleExternalOnSuccess,
    enabled,
  })

  const {
    isPending: isPendingUserEmails,
    error: errorUserEmails,
    refetch: refetchUserEmails,
  } = useUserEmailsQuery

  const isPending: boolean = isPendingUserEmails || isSubmittingMfa

  const error: AxiosError<GenericError> | null = errorUserEmails

  function handleError() {
    if (errorUserEmails) {
      refetchUserEmails()
    }
  }

  const onSubmit = useCallback(
    async (data: any) => {
      switch (step) {
        case VoucherStep.Form:
          const userEmail = await createWalletEmailAsync({
            address: wallet?.adapter?.publicKey?.toBase58() ?? "",
            email: data.email,
          })

          await handleCreateMfaChallenge(
            {
              //@ts-ignore
              address: wallet?.adapter?.publicKey?.toBase58() ?? "",
              methodId: MultiFactorAuthenticationMethodId.Email,
              reasonId:
                MultiFactorAuthenticationReasonId.ConfirmEmail,
            },
            (challenge: MultiFactorAuthenticationChallenge) => {
              push({
                query: {
                  ...query,
                  step: VoucherStep.Validate,
                  email: userEmail?.email,
                  emailId: userEmail?.id?.toString(),
                  challengeId: challenge?.id?.toString(),
                },
                hash: ModalsKey.CreateVoucher,
              })
            }
          )
          break
        case VoucherStep.Validate:
          await handleVerifyMfaChallenge(
            {
              challengeId: query?.challengeId as any,
              code: data.code,
            },
            handleChallengeVerify
          )
          break
        case VoucherStep.Voucher:
          createReferralVoucher(
            {
              code: data.voucher,
              address: wallet?.adapter?.publicKey?.toBase58() ?? "",
            },
            {
              onSuccess: () => {
                NotificationsService.success({
                  title: "voucher_created_successfully_title",
                  message: "voucher_created_successfully_message",
                })
                queryClient.invalidateQueries({
                  queryKey: [ReferralVouchersEmailsQueryKeys.Primary],
                })
                onClose()
              },
            }
          )
          break
        default:
          break
      }
    },
    [
      step,
      wallet,
      queryClient,
      NotificationsService,
      onClose,
      createReferralVoucher,
    ]
  )

  return {
    step,
    onSubmit,
    isPending,
    error,
    handleError,
    useUserEmailsQuery,
    isSubmitting,
    mfaChallengeByIdQuery,
  }
}
