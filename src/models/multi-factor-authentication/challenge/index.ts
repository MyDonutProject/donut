import { BaseEntity } from "@/models/base-entity"
import { MultiFactorAuthenticationMethod } from "../methods"
import { MultiFactorAuthenticationReason } from "../reasons"
import { MultiFactorAuthenticationChallengeMetadata } from "./metadata"
import { MultiFactorAuthenticationChallengeStatus } from "./statuses"
import { MultiFactorAuthenticationChallengeStatusIdType } from "./statuses/id"
import { Wallet } from "@project-serum/anchor"

/**
 * Entity representing multi-factor authentication challenges in the system.
 *
 * @class MultiFactorAuthenticationChallenge
 * @extends {BaseEntity<MultiFactorAuthenticationChallenge>}
 *
 * @description
 * This entity stores information about MFA challenges issued to users.
 * Each challenge is associated with a specific user, authentication method,
 * reason for the challenge, and tracks its current status.
 */
export class MultiFactorAuthenticationChallenge extends BaseEntity {
  /**
   * Reference to the user who needs to complete the MFA challenge
   * @type {User}
   *
   * @description
   * Many-to-One relationship with the User entity.
   * Indicates which user this MFA challenge belongs to.
   */
  wallet: Wallet

  /**
   * Unique identifier of the associated user
   * @type {bigint}
   *
   * @description
   * Foreign key linking to the User entity.
   */
  walletId: bigint

  /**
   * Reference to the authentication method used for this challenge
   * @type {MultiFactorAuthenticationMethod}
   *
   * @description
   * Many-to-One relationship with the MultiFactorAuthenticationMethod entity.
   * Specifies which authentication method is being used (e.g., SMS, Email, Authenticator App).
   */
  method: MultiFactorAuthenticationMethod

  /**
   * Unique identifier of the associated authentication method
   * @type {bigint}
   *
   * @description
   * Foreign key linking to the MultiFactorAuthenticationMethod entity.
   */
  methodId: bigint

  /**
   * Reference to the reason for this authentication challenge
   * @type {MultiFactorAuthenticationReason}
   *
   * @description
   * Many-to-One relationship with the MultiFactorAuthenticationReason entity.
   * Indicates why this MFA challenge was issued (e.g., login, withdrawal, settings change).
   */
  reason: MultiFactorAuthenticationReason

  /**
   * Unique identifier of the associated reason
   * @type {bigint}
   *
   * @description
   * Foreign key linking to the MultiFactorAuthenticationReason entity.
   */
  reasonId: bigint

  /**
   * Reference to the current status of this challenge
   * @type {GameRoundStatus}
   *
   * @description
   * Many-to-One relationship with the GameRoundStatus entity.
   * Tracks the current state of the MFA challenge (e.g., pending, completed, failed).
   */
  status: MultiFactorAuthenticationChallengeStatusIdType

  /**
   * Unique identifier of the associated status
   * @type {bigint}
   *
   * @description
   * Foreign key linking to the GameRoundStatus entity.
   */
  statusId: bigint

  /**
   * The verification code for this challenge
   * @type {string}
   *
   * @description
   * The code that the user needs to verify the challenge.
   */
  code: string

  /**
   * Number of failed verification attempts for this challenge
   * @type {number}
   * @default 0
   *
   * @description
   * Tracks how many times the user has attempted and failed to verify this challenge.
   * Used for security measures like rate limiting or locking after too many attempts.
   */
  attempts: number

  /**
   * Additional data related to this authentication challenge
   * @type {Record<string, any>}
   *
   * @description
   * Stores method-specific data in JSONB format, such as:
   * - For SMS/Email: masked destination, verification code (hashed)
   * - For Authenticator App: challenge parameters
   * - Any other data needed for verification or auditing
   */
  metadata: MultiFactorAuthenticationChallengeMetadata

  /**
   * Timestamp when this challenge expires
   * @type {Date}
   *
   * @description
   * Defines when this MFA challenge is no longer valid.
   * Challenges typically expire after a short period for security reasons.
   */
  expiresAt: Date
}

export type {
  MultiFactorAuthenticationChallengeMetadata,
  MultiFactorAuthenticationChallengeStatus,
  MultiFactorAuthenticationChallengeStatusIdType,
}
