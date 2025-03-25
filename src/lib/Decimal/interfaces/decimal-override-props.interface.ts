import { DecimalOptions } from './decimal-options.interface';
import { Numeric } from './numeric.interface';

/**
 * The DecimalOverrideProps type defines the structure for overriding decimal properties.
 * It includes an amount and options for customizing the decimal behavior.
 */
export type DecimalOverrideProps = {
  /**
   * The amount to be used for the decimal operation.
   * It can be a number, bigint, or string representing a numeric value.
   */
  amount: Numeric;

  /**
   * The options to customize the decimal behavior.
   * It is a partial type of DecimalOptions, allowing for optional properties.
   */
  options: Partial<DecimalOptions>;
};
