/**
 * Namespace containing identifiers for different multi-factor authentication challenge statuses
 *
 * @description
 * This namespace defines the unique identifiers for each possible status of an MFA challenge.
 * These IDs are used throughout the system to track and manage the lifecycle of MFA verification attempts.
 * Each status represents a distinct state in the MFA challenge workflow.
 */
export namespace MultiFactorAuthenticationChallengeStatusId {
  /**
   * Challenge is awaiting user verification
   * @type {bigint}
   *
   * @description
   * Represents a newly created MFA challenge that has been issued but not yet completed.
   * The user has not submitted their verification code or completed the challenge.
   * This is the initial state of any MFA challenge in the system.
   */
  export const Pending: bigint = 1n;

  /**
   * Challenge has been successfully verified
   * @type {bigint}
   *
   * @description
   * Represents an MFA challenge that the user has successfully completed by providing
   * the correct verification code or completing the required authentication steps.
   * This status indicates a successful authentication attempt and allows the user to proceed.
   */
  export const Verified: bigint = 2n;

  /**
   * Challenge verification has failed
   * @type {bigint}
   *
   * @description
   * Represents an MFA challenge where the user has provided incorrect verification
   * information or the verification process has otherwise failed. This may occur due to
   * wrong codes, invalid tokens, or other authentication errors.
   */
  export const Failed: bigint = 3n;

  /**
   * Challenge has expired without verification
   * @type {bigint}
   *
   * @description
   * Represents an MFA challenge that has exceeded its time limit without being
   * successfully verified, making it no longer valid for authentication.
   * Expired challenges require the user to request a new challenge to authenticate.
   */
  export const Expired: bigint = 4n;
}

/**
 * Type representing all possible multi-factor authentication challenge status IDs
 *
 * @description
 * This type is derived from the MultiFactorAuthenticationChallengeStatusId namespace
 * and represents any of the valid status ID values that can be used in the system.
 * It ensures type safety when working with MFA challenge statuses.
 */
export type MultiFactorAuthenticationChallengeStatusIdType =
  (typeof MultiFactorAuthenticationChallengeStatusId)[keyof typeof MultiFactorAuthenticationChallengeStatusId];
