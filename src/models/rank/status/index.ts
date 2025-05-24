import { Decimal } from "@/lib/Decimal"
import { BaseEntity } from "@/models/base-entity"
import { Wallet } from "@project-serum/anchor"
import { Rank } from ".."

/**
 * Entity representing a user's rank status and progression
 * @class RankStatus
 * @extends {BaseEntity<RankStatus>}
 * @description Tracks user's current rank, next rank target, and progression metrics
 */
export class RankStatus extends BaseEntity {
  /**
   * Unique identifier of the associated wallet
   * @type {bigint}
   * @unique
   */
  walletId: bigint

  /**
   * Many-to-one relationship with Wallet entity
   * @type {Wallet}
   */
  wallet: Wallet

  /**
   * User's progress towards next rank
   * @type {Decimal}
   * @default 0
   */
  progress: Decimal

  /**
   * Identifier of user's current rank
   * @type {bigint}
   */
  rankId: bigint

  /**
   * Many-to-one relationship with current Rank entity
   * @type {Rank}
   */
  rank: Rank

  /**
   * Identifier of user's next target rank
   * @type {bigint}
   */
  nextRankId: bigint

  /**
   * Many-to-one relationship with next target Rank entity
   * @type {Rank}
   */
  nextRank: Rank
}
