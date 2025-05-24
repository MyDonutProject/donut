import { BaseEntity } from "@/models/base-entity"
import { Matrix } from ".."
import { Wallet } from "@/models/wallet"

/**
 * Entity representing a slot within a matrix structure
 * @class MatrixSlot
 * @extends {BaseEntity<MatrixSlot>}
 * @description Defines the structure and properties of a matrix slot entity that links wallets to specific positions in a matrix
 */
export class MatrixSlot extends BaseEntity {
  /**
   * Foreign key reference to the parent matrix
   * @type {bigint}
   * @description Numeric identifier linking to the matrix record
   */
  matrixId: bigint

  /**
   * Many-to-one relationship with the Matrix entity
   * @type {Matrix}
   * @description Reference to the parent matrix object containing this slot
   */
  matrix: Matrix

  /**
   * Foreign key reference to the associated wallet that referred this slot
   * @type {bigint}
   * @description Numeric identifier linking to the referral wallet record for this slot position
   */
  referralId: bigint

  /**
   * Many-to-one relationship with the Wallet entity for referrals
   * @type {Wallet}
   * @description Reference to the wallet object that referred/invited the user to this slot position
   */
  referral: Wallet

  /**
   * Position of this slot within the matrix
   * @type {number}
   * @description Integer representing the slot's position/order in the matrix structure
   */
  position: number
}
