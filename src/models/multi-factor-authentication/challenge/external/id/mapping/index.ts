import { BaseEntity } from "@/models/base-entity"
import { MultiFactorAuthenticationChallenge } from "../../.."

/**
 * Entity for mapping external identifiers to multi-factor authentication challenges
 * @class MultiFactorAuthenticationChallengeExternalIdMapping
 * @extends {BaseEntity<MultiFactorAuthenticationChallengeExternalIdMapping>}
 * @description Maps external system identifiers to internal MFA challenge records for cross-system tracking
 */
export class MultiFactorAuthenticationChallengeExternalIdMapping extends BaseEntity {
  /**
   * Foreign key ID referencing the associated MFA challenge
   * @type {bigint}
   * @description Links to the internal MFA challenge this mapping belongs to
   */
  challengeId: bigint

  /**
   * Many-to-One relationship with the MFA Challenge entity
   * @type {MultiFactorAuthenticationChallenge}
   * @description Links this mapping to its corresponding MFA challenge record
   */
  challenge: MultiFactorAuthenticationChallenge

  /**
   * External identifier from third-party authentication systems
   * @type {string}
   * @description Unique identifier assigned by external authentication providers or services
   * @maxLength 256
   */
  externalId: string
}
