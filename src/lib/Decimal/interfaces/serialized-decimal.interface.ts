/**
 * Represents a scaled value.
 */
export interface SerializedDecimal {
  type: 'decimal';

  /**
   * Raw value in base units (e.g., cents, grams).
   */
  value: string;

  /**
   * Scaling factor (e.g., 100 for cents to dollars).
   */
  scale: number;
}
