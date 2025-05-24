import { BaseEntity } from "../base-entity"

/**
 * Entity representing a blockchain transaction in the system
 * @class Transaction
 * @extends {BaseEntity<Transaction>}
 * @description Defines the structure and properties of a transaction entity that tracks blockchain transactions
 */
export class Transaction extends BaseEntity {
  /**
   * Foreign key reference to the associated wallet
   * @type {bigint}
   * @description Numeric identifier linking to the wallet record that initiated the transaction
   */
  walletId: bigint

  /**
   * Transaction hash/ID on the blockchain
   * @type {string}
   * @description Unique identifier of the transaction on the blockchain network
   */
  hash: string

  /**
   * URL to view transaction details
   * @type {string}
   * @description Web URL where the transaction can be viewed on a blockchain explorer
   */
  url: string
}
