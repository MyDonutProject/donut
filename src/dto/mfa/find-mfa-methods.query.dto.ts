import { MultiFactorAuthenticationReasonIdType } from "@/models/multi-factor-authentication/reasons/id"
import { PaginatedRequest } from "@/models/pagination/paginated-request"

/**
 * Query class for finding multi-factor authentication methods with pagination
 *
 * @description This query extends the base PaginationParamsQuery to provide
 * standardized pagination capabilities when searching for multi-factor authentication methods.
 * It doesn't add any additional parameters beyond the standard pagination parameters.
 *
 * @example
 * ```json
 * {
 *   "page": 1,
 *   "limit": 10
 * }
 * ```
 */
export class FindMultiFactorAuthenticationMethodsQuery extends PaginatedRequest {
  /**
   * Optional reason ID to filter MFA methods
   * @type {bigint}
   * @optional
   * @description The unique identifier of the reason to filter MFA methods
   * @example 1
   */
  reasonId: MultiFactorAuthenticationReasonIdType
}
