import { BaseEntity } from "@/models/base-entity"
import { Wallet } from ".."

/**
 * Entity representing email addresses associated with wallets
 * @class WalletEmail
 * @extends {BaseEntity<WalletEmail>}
 * @description Stores and manages email addresses linked to user wallets, including verification status
 */
export class WalletEmail extends BaseEntity {
  /**
   * Email address associated with the wallet
   * @type {string}
   * @description Unique email address with maximum length of 256 characters.
   * The uniqueness constraint ensures each email can only be associated with one wallet.
   */
  email: string

  /**
   * Many-to-one relationship with the Wallet entity
   * @type {Wallet}
   * @description Reference to the associated wallet object
   */
  wallet: Wallet

  /**
   * Foreign key reference to the associated wallet
   * @type {bigint}
   * @description Unique identifier linking to the wallet record.
   * The uniqueness constraint ensures each wallet can only have one email address.
   */
  walletId: bigint

  /**
   * Email verification status
   * @type {boolean}
   * @description Indicates whether the email address has been verified.
   * Defaults to false until verification is completed.
   */
  verified: boolean
}
