import { useMutation } from "@tanstack/react-query"
import { fetchCreateReferralVoucher } from "./service"
import { AxiosError } from "axios"
import { GenericError } from "@/models/generic-error"
import { ReferralVoucher } from "@/models/referral-vouchers"
import { CreateVoucherDto } from "@/dto/referral-voucher/create-referral-voucher-input.dto"

/**
 * Custom hook to verify user email addresses
 *
 * This hook handles the verification of user email addresses and manages the mutation state.
 * It uses React Query for data mutation, cache invalidation, and handles success notifications.
 * On successful verification, it closes the email modal, invalidates relevant queries, and shows a success message.
 *
 * @returns {Object} An object containing:
 *   - verifyUserEmail: Function to trigger email verification (non-async)
 *   - verifyUserEmailAsync: Function to trigger email verification (async version)
 *   - isPending: Boolean indicating if verification is in progress
 */
export function useCreateReferralVoucher() {
  /**
   * Success callback handler for email verification
   * Closes modal, invalidates queries, and shows success notification
   *
   * @param {Success} _ - Success response from the server (unused)
   * @param {UserEmailVerifyInputDto} data - The verification input data containing emailId
   */
  const { isPending, mutate, mutateAsync } = useMutation<
    ReferralVoucher,
    AxiosError<GenericError>,
    CreateVoucherDto
  >({
    mutationFn: fetchCreateReferralVoucher,
  })

  return {
    createReferralVoucher: mutate,
    isPending,
    createReferralVoucherAsync: mutateAsync,
  }
}
