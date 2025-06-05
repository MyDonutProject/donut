import { useMutation } from "@tanstack/react-query"
import { fetchCreateWalletEmail } from "./service"
import { AxiosError } from "axios"
import { WalletEmail } from "@/models/wallet/emails"
import { GenericError } from "@/models/generic-error"
import { CreateWalletEmailInputDto } from "@/dto/wallet-emails/create-wallet-emails-input.dto"

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
export function useCreateWalletEmail() {
  /**
   * Success callback handler for email verification
   * Closes modal, invalidates queries, and shows success notification
   *
   * @param {Success} _ - Success response from the server (unused)
   * @param {UserEmailVerifyInputDto} data - The verification input data containing emailId
   */
  const { isPending, mutate, mutateAsync } = useMutation<
    WalletEmail,
    AxiosError<GenericError>,
    CreateWalletEmailInputDto
  >({
    mutationFn: fetchCreateWalletEmail,
  })

  return {
    createWalletEmail: mutate,
    isPending,
    createWalletEmailAsync: mutateAsync,
  }
}
