/**
 * Adds a thousands separator to a numeric value.
 *
 * @param {string} value - The numeric value to format.
 * @param {string} separator - The separator to use between thousands.
 * @returns {string} The formatted value with thousands separators.
 */
export function addThousandsSeparator(value: string, separator: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}
