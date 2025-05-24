/**
 * @description Namespace representing the different statuses a matrix can have.
 * Each status is associated with a unique numeric identifier using BigInt (n suffix).
 *
 * @property {bigint} Pending - Status ID 1: Represents a matrix that is still in progress
 * @property {bigint} Completed - Status ID 2: Represents a matrix that has been completed
 */
export namespace MatrixStatusId {
  // Status for matrices that are still in progress
  export const Pending = 1n

  // Status for matrices that have been completed
  export const Completed = 2n
}

/**
 * @description Type representing the possible values of MatrixStatusId.
 * This type is derived from the keys of the MatrixStatusId namespace.
 *
 * @type {bigint} - A BigInt value representing one of the matrix status identifiers
 */
export type MatrixStatusIdType =
  (typeof MatrixStatusId)[keyof typeof MatrixStatusId]
