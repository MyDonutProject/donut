import { getDecimalPartLength } from './getDecimalPartLength';

/**
 * Function to get the default number of decimal places between two numbers.
 *
 * @param {number} start - The starting number to compare decimal places.
 * @param {number} [end=1] - The ending number to compare decimal places. Defaults to 1 if not provided.
 * @returns {number} The maximum number of decimal places between the start and end numbers.
 *
 * Example usage:
 * const defaultDecimals = getDefaultDecimalPlaces(123.456, 78.9); // Returns 3
 * const defaultDecimals = getDefaultDecimalPlaces(123.456); // Returns 3
 * const defaultDecimals = getDefaultDecimalPlaces(123, 78.9); // Returns 1
 */
export function getDefaultDecimalPlaces(start: number, end?: number): number {
  // Get the number of decimal places in the start number
  const startDecimals = getDecimalPartLength(start);
  // Get the number of decimal places in the end number, defaulting to 1 if end is not provided
  const endDecimals = getDecimalPartLength(end || 1);

  // Return the maximum number of decimal places between start and end
  return startDecimals >= endDecimals ? startDecimals : endDecimals;
}
