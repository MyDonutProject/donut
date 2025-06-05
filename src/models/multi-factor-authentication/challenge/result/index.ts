import { MultiFactorAuthenticationChallenge } from '..';

/**
 * Interface representing the result of a multi-factor authentication challenge verification attempt
 *
 * @interface VerifyMultiFactorAuthenticationChallengeResult
 *
 * @description
 * This interface defines the structure of the response returned when verifying
 * a multi-factor authentication challenge. It includes information about whether
 * the verification was successful and the updated challenge entity with its current state.
 * This result is typically returned by the verification use case and can be used
 * to determine subsequent actions in the authentication flow.
 */
export interface VerifyMultiFactorAuthenticationChallengeResult {
  /**
   * Whether the verification was successful
   * @type {boolean}
   *
   * @description
   * Indicates if the user-provided verification code matched the expected code.
   * - true: The challenge was successfully verified
   * - false: The verification failed (wrong code, expired challenge, or too many attempts)
   */
  success: boolean;

  /**
   * The updated challenge entity
   * @type {MultiFactorAuthenticationChallenge}
   *
   * @description
   * The challenge entity after the verification attempt, containing updated information such as:
   * - Current status (pending, verified, failed, expired)
   * - Number of attempts made
   * - Any other state changes resulting from the verification attempt
   * This can be used to determine the next steps in the authentication flow.
   */
  challenge: MultiFactorAuthenticationChallenge;
}
