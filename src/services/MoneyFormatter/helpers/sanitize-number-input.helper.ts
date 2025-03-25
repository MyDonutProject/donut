/**
 * Sanitizes the numeric input string by:
 * - Removing any non-numeric characters (except decimal separators and minus sign).
 * - Ensuring the minus sign is only at the beginning.
 * - Handling duplicated decimal separators.
 * - Adjusting leading and trailing dots.
 */
export function sanitizeNumberInput(input: string): string {
  // Remove any character that is not a digit, comma, dot, or minus sign
  let sanitized: string = input.replace(/[^\d.,-]/g, "");

  // Handle minus signs:
  // Remove all minus signs not at the beginning
  sanitized = sanitized.replace(/(?!^)-/g, "");
  // Replace multiple leading minus signs with a single one
  sanitized = sanitized.replace(/^-+/, "-");

  // Replace commas with dots for decimal separation
  sanitized = sanitized.replace(/,/g, ".");

  // Remove multiple dots, keeping only the first one
  const parts: Array<string> = sanitized.split(".");

  if (parts.length > 1) {
    sanitized = parts[0] + "." + parts.slice(1).join("");
  }

  // If the input starts with a dot or minus followed by a dot, add a leading zero
  sanitized = sanitized.replace(/^(-)?\./, "$10.");

  // Remove trailing dot
  sanitized = sanitized.replace(/\.$/, "");

  return sanitized;
}
