import { BaseEntity } from "@/models/base-entity"
import { MultiFactorAuthenticationMethod } from "../.."
import { MultiFactorAuthenticationReason } from "../../../reasons"

/**
 * Entity representing the mapping between MFA methods and reasons
 * @class MultiFactorAuthenticationMethodReasonMapping
 * @extends {BaseEntity<MultiFactorAuthenticationMethodReasonMapping>}
 * @description Maps multi-factor authentication methods to their corresponding reasons,
 * establishing many-to-many relationships between methods and reasons
 */
export class MultiFactorAuthenticationMethodReasonMapping extends BaseEntity {
  /**
   * The unique identifier of the MFA method
   * @type {bigint}
   * @description Foreign key referencing the MFA method
   */
  methodId: bigint

  /**
   * The MFA method associated with this mapping
   * @type {MultiFactorAuthenticationMethod}
   * @description Many-to-one relationship with MFA method entity
   */
  method: MultiFactorAuthenticationMethod

  /**
   * The unique identifier of the MFA reason
   * @type {bigint}
   * @description Foreign key referencing the MFA reason
   */
  reasonId: bigint

  /**
   * The MFA reason associated with this mapping
   * @type {MultiFactorAuthenticationReason}
   * @description Many-to-one relationship with MFA reason entity
   */
  reason: MultiFactorAuthenticationReason
}
