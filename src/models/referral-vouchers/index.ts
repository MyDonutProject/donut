import { BaseEntity } from "../base-entity"
import { Wallet } from "../wallet"

/**
 * Entity representing referral vouchers in the system
 * @class ReferralVoucher
 * @extends {BaseEntity<ReferralVoucher>}
 * @description Manages referral vouchers associated with user wallets, including unique codes and URLs.
 * Each wallet can only have one voucher (enforced by unique walletId) and each voucher code must be unique system-wide.
 */
export class ReferralVoucher extends BaseEntity {
  /**
   * Unique voucher code
   * @type {string}
   * @description A unique identifier code for the voucher with maximum length of 21 characters.
   * Must be unique across all vouchers in the system to prevent duplicate codes.
   */
  code: string

  /**
   * Many-to-one relationship with the Wallet entity
   * @type {Wallet}
   * @description Reference to the wallet that owns this voucher. Cannot be null.
   * Each wallet can have at most one voucher due to unique constraint on walletId.
   */
  wallet: Wallet

  /**
   * Foreign key reference to the associated wallet
   * @type {bigint}
   * @description Unique identifier linking to the wallet record, stored as bigint.
   * The unique constraint ensures each wallet can only have one voucher.
   */
  walletId: bigint

  /**
   * Referral URL for the voucher
   * @type {string}
   * @description The URL used for sharing and tracking referrals, with maximum length of 256 characters
   */
  url: string
}
