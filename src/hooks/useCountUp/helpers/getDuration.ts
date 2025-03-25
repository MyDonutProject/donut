/**
 * Function to get the duration for a count-up operation.
 *
 * @param {number} [end] - The end value for the count-up operation. Optional parameter.
 * @param {number} [duration] - The duration for the count-up operation. Optional parameter.
 * @returns {number | undefined} - Returns the duration if provided, otherwise returns 2. If the end value is not a number, returns undefined.
 *
 * Example usage:
 * const duration = getDuration(100, 5); // Returns 5
 * const duration = getDuration(100); // Returns 2
 * const duration = getDuration(); // Returns undefined
 */
export function getDuration(
  end?: number,
  duration?: number,
): number | undefined {
  // Check if the end value is not a number
  if (typeof end !== 'number') {
    // Return undefined if the end value is not a number
    return undefined;
  }

  // Return the duration if provided, otherwise return 2
  return typeof duration === 'number' ? duration : 2;
}
