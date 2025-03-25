/**
 * Function to get the length of the decimal part of a number.
 *
 * @param {number} num - The number to get the decimal part length from.
 * @returns {number} The length of the decimal part of the number.
 *
 * Example usage:
 * const length = getDecimalPartLength(123.456); // Returns 3
 * const length = getDecimalPartLength(123); // Returns 0
 */
export function getDecimalPartLength(num: number): number {
  return (num.toString().split('.')[1] || '').length;
}
