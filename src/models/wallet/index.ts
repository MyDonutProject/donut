import { BaseEntity } from "../base-entity"

/**
 * Entity representing a wallet in the system
 * @class Wallet
 * @extends {BaseEntity<Wallet>}
 * @description Defines the structure and properties of a wallet entity in the database
 */
export class Wallet extends BaseEntity {
  /**
   * The unique blockchain address associated with this wallet
   * @type {string}
   * @description A 44-character string representing the wallet's public address
   * @unique
   * @required
   */
  address: string
}
