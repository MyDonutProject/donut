/**
 * Namespace containing identifiers for different multi-factor authentication reasons
 *
 * @description
 * This namespace defines the unique identifiers for each scenario where MFA might be required.
 * These IDs are used throughout the system to identify the specific context that triggered
 * an MFA verification request.
 */
export namespace MultiFactorAuthenticationReasonId {
  /**
   * Email confirmation verification
   * @type {bigint}
   *
   * @description
   * Required when a user attempts to confirm their email address.
   */
  export const ConfirmEmail: bigint = 1n
}

/**
 * Type representing all possible multi-factor authentication reason IDs
 *
 * @description
 * This type is derived from the MultiFactorAuthenticationReasonId namespace
 * and represents any of the valid reason ID values that can be used in the system.
 * It ensures type safety when working with MFA reason IDs.
 */
export type MultiFactorAuthenticationReasonIdType =
  (typeof MultiFactorAuthenticationReasonId)[keyof typeof MultiFactorAuthenticationReasonId]
