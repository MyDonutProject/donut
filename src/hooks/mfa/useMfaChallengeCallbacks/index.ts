/**
 * @file MFA Challenge Callback Hooks
 * @description Custom hooks for handling MFA challenge creation and verification
 */

import { MultiFactorAuthenticationChallenge } from "@/models/multi-factor-authentication/challenge"
import { VerifyMultiFactorAuthenticationChallengeResult } from "@/models/multi-factor-authentication/challenge/result"
import { CreateMfaChallengeDto } from "@/dto/mfa/create-mfa-challenge.dto"
import { VerifyMfaChallengeDto } from "@/dto/mfa/verify-challenge.dto"
import { useCallback } from "react"
import {
  useCreateChallenge,
  useVerifyChallenge,
} from "@/api/mfa/mutations"
import { useNotificationService } from "@/hooks/notifications/useNotificationService"

/**
 * Hook for managing MFA challenge creation and verification callbacks
 * @returns {Object} Object containing MFA challenge handlers and state
 * @property {Function} handleCreateMfaChallenge - Function to create an MFA challenge
 * @property {Function} handleVerifyMfaChallenge - Function to verify an MFA challenge
 * @property {boolean} isPending - Whether any MFA operation is in progress
 * @property {VerifyMultiFactorAuthenticationChallengeResult} verifyChallengeData - Result data from challenge verification
 * @property {MultiFactorAuthenticationChallenge} createChallengeData - Result data from challenge creation
 */
export function useMfaChallengeCallbacks() {
  const {
    verifyChallenge,
    loadingVerifyChallenge,
    data: verifyChallengeData,
  } = useVerifyChallenge()
  const {
    createChallenge,
    loadingCreateChallenge,
    data: createChallengeData,
  } = useCreateChallenge()

  const { NotificationsService } = useNotificationService()

  /**
   * Handles creation of a new MFA challenge
   * @param {CreateMfaChallengeDto} dto - Data transfer object for challenge creation
   * @param {Function} callback - Optional callback function called on successful challenge creation
   * @returns {Promise<void>} Promise that resolves when challenge is created
   */
  const handleCreateMfaChallenge = useCallback(
    async (
      dto: CreateMfaChallengeDto,
      callback?: (
        data: MultiFactorAuthenticationChallenge,
        variables: CreateMfaChallengeDto
      ) => void
    ) => {
      return await createChallenge(dto, {
        onSuccess: (
          data: MultiFactorAuthenticationChallenge,
          variables: CreateMfaChallengeDto
        ) => {
          if (callback) {
            callback(data, variables)
          }
        },
      })
    },
    [createChallenge]
  )

  /**
   * Handles verification of an existing MFA challenge
   * @param {VerifyMfaChallengeDto} dto - Data transfer object for challenge verification
   * @param {Function} callback - Optional callback function called on successful challenge verification
   * @returns {Promise<void>} Promise that resolves when challenge is verified
   */
  const handleVerifyMfaChallenge = useCallback(
    async (
      dto: VerifyMfaChallengeDto,
      callback?: (
        data: VerifyMultiFactorAuthenticationChallengeResult,
        variables: VerifyMfaChallengeDto
      ) => void
    ) => {
      try {
        return await verifyChallenge(dto, {
          onSuccess: (
            data: VerifyMultiFactorAuthenticationChallengeResult,
            variables: VerifyMfaChallengeDto
          ) => {
            if (callback && data?.success) {
              callback(data, variables)
            }

            if (!data?.success) {
              NotificationsService.error({
                title: "invalid_code",
                message: "invalid_code_description",
              })
            }
          },
        })
      } catch (error) {}
    },
    [NotificationsService]
  )

  return {
    handleCreateMfaChallenge,
    handleVerifyMfaChallenge,
    isPending: loadingCreateChallenge || loadingVerifyChallenge,
    verifyChallengeData,
    createChallengeData,
  }
}
