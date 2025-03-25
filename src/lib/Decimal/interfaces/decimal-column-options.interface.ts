import { Either } from '@/interfaces/either';
import { Decimal } from '../utils';
import { SerializedDecimal } from './serialized-decimal.interface';

/**
 * Interface for configuring a Decimal column in a database.
 * Defines properties for nullability and default values.
 */
export interface DecimalColumnOptions {
  /**
   * Indicates if the column can have null values.
   * - true: Column can be null.
   * - false or undefined: Column cannot be null.
   */
  nullable?: boolean;

  /**
   * Specifies the default value for the column.
   * Used when no explicit value is provided.
   * Can be:
   * - Decimal instance: Represents a precise decimal value.
   * - SerializedDecimal: Structured representation of a decimal.
   */
  default?: Either<SerializedDecimal, Decimal>;
}
