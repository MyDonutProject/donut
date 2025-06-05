/**
 * Namespace containing identifiers for different multi-factor authentication methods
 *
 * @description
 * This namespace defines the unique identifiers for each supported MFA method in the system.
 * These IDs are used in database relationships and business logic to identify which
 * authentication method is being used.
 */
export namespace MultiFactorAuthenticationMethodId {
  /**
   * Email-based authentication method
   * @type {bigint}
   *
   * @description
   * Represents verification through emails sent to the user's registered email address.
   * The system sends a one-time code via email that the user must enter to complete authentication.
   */
  export const Email: bigint = 1n
}

/**
 * Type representing all possible multi-factor authentication method IDs
 *
 * @description
 * This type is derived from the MultiFactorAuthenticationMethodId namespace
 * and represents any of the valid method ID values that can be used in the system.
 * It ensures type safety when working with MFA method IDs.
 */
export type MultiFactorAuthenticationMethodIdType =
  (typeof MultiFactorAuthenticationMethodId)[keyof typeof MultiFactorAuthenticationMethodId]
