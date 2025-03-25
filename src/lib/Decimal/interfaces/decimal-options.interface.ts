/**
 * The DecimalOptions interface defines the configuration options for decimal operations.
 * It includes properties for specifying the scale and high scale values, which determine
 * the precision and representation of decimal values.
 */
export interface DecimalOptions {
  /**
   * The scale property represents the number of decimal places to be used for the decimal value.
   * It determines the precision of the decimal representation.
   */
  scale: number;

  /**
   * The highScale property represents an alternative scale value that can be used for specific
   * operations requiring higher precision.
   */
  highScale: number;
}
