/**
 * Multi-Factor Authentication Challenge DTO
 *
 * @description Data Transfer Object for creating a new MFA challenge
 * @module MFA
 */

import { MultiFactorAuthenticationMethodIdType } from "../../models/multi-factor-authentication/methods/id"
import { MultiFactorAuthenticationReasonIdType } from "../../models/multi-factor-authentication/reasons/id"

/**
 * @class CreateMfaChallengeDto
 * @description DTO for creating a new multi-factor authentication challenge
 *
 * This class defines the structure for initiating an MFA challenge with
 * validation rules for each property. It supports different MFA methods
 * and reasons, with optional contact identifiers.
 *
 * @property {MultiFactorAuthenticationMethodIdType} methodId - The MFA method to use
 * @property {MultiFactorAuthenticationReasonIdType} reasonId - The reason for the MFA challenge
 * @property {bigint} emailId - Optional email identifier for email-based verification
 * @property {bigint} phoneNumberId - Optional phone number identifier for SMS-based verification
 */
export class CreateMfaChallengeDto {
  /**
   * The MFA method to be used for this challenge
   * @type {MultiFactorAuthenticationMethodIdType}
   * @required
   * @description Specifies which authentication method to use (e.g. SMS, email, authenticator app)
   * @example 1 - Email verification
   * @example 2 - SMS verification
   */
  methodId: MultiFactorAuthenticationMethodIdType

  /**
   * The reason for initiating this MFA challenge
   * @type {MultiFactorAuthenticationReasonIdType}
   * @required
   * @description Indicates why the MFA challenge is being created (e.g. login, withdrawal, settings change)
   * @example 1 - Login verification
   * @example 2 - Withdrawal verification
   */
  reasonId: MultiFactorAuthenticationReasonIdType

  /**
   * Email identifier for email-based verification
   * @type {bigint}
   * @optional
   * @description The ID of the email to send verification to (required when using email method)
   */
  address?: bigint
}
