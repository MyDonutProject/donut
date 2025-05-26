import { SerializedDecimal } from "../interfaces"

// Default value for Decimal columns
export const DEFAULT_DECIMAL_COLUMN_VALUE: SerializedDecimal = {
  type: "decimal",
  value: "0", // Default amount in subunits
  scale: 9, // Default number of decimal places
}
