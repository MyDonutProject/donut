import { BaseEntity } from "../base-entity"
import { Wallet } from "../wallet"
import { MatrixSlot } from "./slots"
import { MatrixStatus } from "./statuses"

export class Matrix extends BaseEntity {
  /**
   * Foreign key reference to the matrix status
   * @type {bigint}
   * @description Numeric identifier linking to the matrix status record
   */
  statusId: bigint

  /**
   * Many-to-one relationship with the MatrixStatus entity
   * @type {MatrixStatus}
   * @description Reference to the associated status object defining the matrix state
   */
  status: MatrixStatus

  /**
   * Foreign key reference to the associated wallet
   * @type {bigint}
   * @description Numeric identifier linking to the wallet record
   */
  walletId: bigint

  /**
   * Many-to-one relationship with the Wallet entity
   * @type {Wallet}
   * @description Reference to the associated wallet object
   */
  wallet: Wallet

  /**
   * One-to-many relationship with MatrixSlot entities
   * @type {Array<MatrixSlot>}
   * @description Collection of slots associated with this matrix
   */
  slots: Array<MatrixSlot>

  /**
   * External ID of the matrix
   * @type {bigint}
   * @description Unique identifier for the matrix
   */
  externalId: bigint
}
