import { DecimalOptions } from '../interfaces';

/**
 * Factory class to generate and configure DecimalOptions.
 * This class provides a static method to generate a complete DecimalOptions object
 * by merging default values with any provided partial options.
 */
export class GenerateDecimalOptionsFactory {
  /**
   * Generates a complete DecimalOptions object.
   *
   * @param {Partial<DecimalOptions>} [options] - Optional partial configuration for DecimalOptions.
   * @returns {DecimalOptions} - The complete DecimalOptions object with default and provided values.
   */
  static generate(options?: Partial<DecimalOptions>): DecimalOptions {
    // Initialize the fullOptions object with default values.
    let fullOptions: Partial<DecimalOptions> = {
      scale: 2, // Default scale value is set to 2.
    };

    // If options are provided, merge them with the default values.
    if (!!options) {
      fullOptions = Object.assign(fullOptions, options);
    }

    // Calculate the highScale value as twice the scale value.
    fullOptions.highScale = (fullOptions as DecimalOptions).scale * 2;

    // Return the complete DecimalOptions object.
    return fullOptions as DecimalOptions;
  }
}
