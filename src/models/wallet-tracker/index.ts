import { Decimal } from "@/lib/Decimal"
import { BaseEntity } from "../base-entity"

/**
 * Entity for tracking wallet statistics and rewards
 * @class WalletTracker
 * @extends {BaseEntity<WalletTracker>}
 * @description Tracks various metrics and rewards associated with a wallet
 */
export class WalletTracker extends BaseEntity {
  /**
   * Foreign key reference to the associated wallet
   * @type {number}
   * @description Numeric identifier linking to the wallet record
   */

  /**
   * Total number of matrices the wallet has participated in
   * @type {number}
   * @description Running count of all matrices joined by this wallet
   */
  totalMatrices: number

  /**
   * Number of matrices the wallet has fully completed
   * @type {number}
   * @description Count of matrices that reached completion state
   */
  completedMatrices: number

  /**
   * Total SOL tokens earned as rewards
   * @type {Decimal}
   * @description Cumulative SOL rewards from all completed matrices
   */
  totalSolReward: Decimal

  /**
   * Total DONUT tokens earned as rewards
   * @type {Decimal}
   * @description Cumulative DONUT rewards from all completed matrices
   */
  totalDonutReward: Decimal
}
