/**
 * Data transfer object for creating a wallet voucher record
 * @class CreateVoucherDto
 * @description Contains validated fields required for creating a new voucher entry
 */
export class CreateVoucherDto {
  /**
   * The voucher code
   * @type {string}
   * @required
   * @description Must be a valid Base58 encoded string
   */
  code: string

  /**
   * The blockchain address associated with the wallet
   * @type {string}
   * @required
   * @description Must be a valid Base58 encoded string
   */
  address: string
}
