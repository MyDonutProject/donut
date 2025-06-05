/**
 * Multi-Factor Authentication Challenge Verification DTO
 *
 * @description Data Transfer Object for verifying an MFA challenge
 * @module MFA
 */

import { AuthenticationResponseJSON } from '@simplewebauthn/browser';

/**
 * @class VerifyMfaChallengeDto
 * @description DTO for verifying a multi-factor authentication challenge
 *
 * This class defines the structure for validating an MFA challenge with
 * the required challenge ID and verification code. It includes validation
 * rules to ensure proper data format.
 *
 * @property {bigint} challengeId - The unique identifier of the MFA challenge to verify
 * @property {string} code - The verification code provided by the user
 */
export class VerifyMfaChallengeDto {
  /**
   * The unique identifier of the MFA challenge
   * @type {bigint}
   * @required
   * @description Identifies which specific MFA challenge is being verified
   * @example 1
   */
  challengeId: bigint;

  /**
   * The verification code for the MFA challenge
   * @type {string}
   * @required
   * @description The code provided by the user to verify their identity
   * @example '123456'
   */
  code?: string;

  passkeyAuthenticationResponse?: AuthenticationResponseJSON;
}
