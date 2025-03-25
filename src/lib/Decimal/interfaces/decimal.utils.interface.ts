import { DecimalOverrideProps } from './decimal-override-props.interface';
import { Numeric } from './numeric.interface';
import { Either } from '@/interfaces/either';
import { Nullable } from '@/interfaces/nullable';

/**
 * The IDecimal interface defines a contract for decimal operations and properties.
 * It provides a comprehensive set of methods for arithmetic operations, comparisons,
 * and conversions involving decimal values. The interface supports operations with
 * both numeric types and other IDecimal instances, offering flexibility in handling
 * various decimal-related tasks.
 */
export interface IDecimal {
  /**
   * Adds a numeric value or another IDecimal instance to the current decimal.
   * @param value - The value to add, which can be a Numeric type or an IDecimal instance.
   * @returns A new IDecimal instance representing the sum.
   */
  add(value: Either<Numeric, IDecimal>): IDecimal;

  /**
   * Subtracts a numeric value or another IDecimal instance from the current decimal.
   * @param value - The value to subtract, which can be a Numeric type or an IDecimal instance.
   * @returns A new IDecimal instance representing the difference.
   */
  sub(value: Either<Numeric, IDecimal>): IDecimal;

  /**
   * Divides the current decimal by a numeric value or another IDecimal instance.
   * @param divisor - The divisor, which can be a Numeric type or an IDecimal instance.
   * @returns A new IDecimal instance representing the quotient.
   */
  divide(divisor: Either<Numeric, IDecimal>): IDecimal;

  /**
   * Multiplies the current decimal by a numeric value or another IDecimal instance.
   * @param multiplier - The multiplier, which can be a Numeric type or an IDecimal instance.
   * @returns A new IDecimal instance representing the product.
   */
  multiply(multiplier: Either<Numeric, IDecimal>): IDecimal;

  /**
   * Sums an array of numeric values or IDecimal instances.
   * @param items - An array of values to sum, each of which can be a Numeric type or an IDecimal instance.
   * @returns A new IDecimal instance representing the total sum.
   */
  sum(items: Array<Either<Numeric, IDecimal>>): IDecimal;

  /**
   * Finds the highest value among an array of numeric values or IDecimal instances.
   * @param items - An array of values to compare, each of which can be a Numeric type or an IDecimal instance.
   * @returns A Nullable IDecimal instance representing the highest value, or null if the array is empty.
   */
  highest(items: Array<Either<Numeric, IDecimal>>): Nullable<IDecimal>;

  /**
   * Finds the lowest value among an array of numeric values or IDecimal instances.
   * @param items - An array of values to compare, each of which can be a Numeric type or an IDecimal instance.
   * @returns A Nullable IDecimal instance representing the lowest value, or null if the array is empty.
   */
  lowest(items: Array<Either<Numeric, IDecimal>>): Nullable<IDecimal>;

  /**
   * Checks if the current decimal is equal to a numeric value or another IDecimal instance.
   * @param value - The value to compare, which can be a Numeric type or an IDecimal instance.
   * @returns A boolean indicating whether the values are equal.
   */
  equals(value: Either<Numeric, IDecimal>): boolean;

  /**
   * Checks if the current decimal is greater than a numeric value or another IDecimal instance.
   * @param value - The value to compare, which can be a Numeric type or an IDecimal instance.
   * @returns A boolean indicating whether the current decimal is greater.
   */
  greater(value: Either<Numeric, IDecimal>): boolean;

  /**
   * Checks if the current decimal is greater than or equal to a numeric value or another IDecimal instance.
   * @param value - The value to compare, which can be a Numeric type or an IDecimal instance.
   * @returns A boolean indicating whether the current decimal is greater or equal.
   */
  greaterOrEquals(value: Either<Numeric, IDecimal>): boolean;

  /**
   * Checks if the current decimal is less than a numeric value or another IDecimal instance.
   * @param value - The value to compare, which can be a Numeric type or an IDecimal instance.
   * @returns A boolean indicating whether the current decimal is less.
   */
  less(value: Either<Numeric, IDecimal>): boolean;

  /**
   * Checks if the current decimal is less than or equal to a numeric value or another IDecimal instance.
   * @param value - The value to compare, which can be a Numeric type or an IDecimal instance.
   * @returns A boolean indicating whether the current decimal is less or equal.
   */
  lessOrEquals(value: Either<Numeric, IDecimal>): boolean;

  /**
   * Clamps the current decimal between a minimum and maximum value.
   * @param min - The minimum value, which can be a Numeric type or an IDecimal instance.
   * @param max - The maximum value, which can be a Numeric type or an IDecimal instance.
   * @returns A new IDecimal instance representing the clamped value.
   */
  clamp(
    min: Either<Numeric, IDecimal>,
    max: Either<Numeric, IDecimal>,
  ): IDecimal;

  /**
   * Calculates the difference between the current decimal and a numeric value or another IDecimal instance.
   * @param value - The value to subtract, which can be a Numeric type or an IDecimal instance.
   * @returns A new IDecimal instance representing the difference.
   */
  diff(value: Either<Numeric, IDecimal>): IDecimal;

  /**
   * Calculates the percentage of the current decimal relative to a numeric value or another IDecimal instance.
   * @param value - The value to calculate the percentage against, which can be a Numeric type or an IDecimal instance.
   * @returns A new IDecimal instance representing the percentage.
   */
  percentage(value: Either<Numeric, IDecimal>): IDecimal;

  /**
   * Checks if the current decimal is strictly between two values.
   * @param lower - The lower bound, which can be a Numeric type or an IDecimal instance.
   * @param upper - The upper bound, which can be a Numeric type or an IDecimal instance.
   * @returns A boolean indicating whether the current decimal is between the bounds.
   */
  isBetween(
    lower: Either<Numeric, IDecimal>,
    upper: Either<Numeric, IDecimal>,
  ): boolean;

  /**
   * Checks if the current decimal is within the inclusive range of two values.
   * @param lower - The lower bound, which can be a Numeric type or an IDecimal instance.
   * @param upper - The upper bound, which can be a Numeric type or an IDecimal instance.
   * @returns A boolean indicating whether the current decimal is within the bounds.
   */
  isWithin(
    lower: Either<Numeric, IDecimal>,
    upper: Either<Numeric, IDecimal>,
  ): boolean;

  /**
   * Checks if the current decimal is positive.
   * @returns A boolean indicating whether the current decimal is positive.
   */
  isPositive(): boolean;

  /**
   * Checks if the current decimal is negative.
   * @returns A boolean indicating whether the current decimal is negative.
   */
  isNegative(): boolean;

  /**
   * Checks if the current decimal is zero.
   * @returns A boolean indicating whether the current decimal is zero.
   */
  isZero(): boolean;

  /**
   * Creates a copy of the current decimal with optional overrides.
   * @param overrides - An optional object containing properties to override in the copy.
   * @returns A new IDecimal instance with the specified overrides.
   */
  copyWith(overrides?: Partial<DecimalOverrideProps>): IDecimal;

  /**
   * Converts the current decimal to a JavaScript number.
   * @returns The numeric representation of the current decimal as a number.
   */
  toNumber(): number;

  /**
   * Converts the current decimal to a string representation.
   * @returns The string representation of the current decimal.
   */
  toString(): string;

  /**
   * Converts the current decimal to its subunit representation as a bigint.
   * @returns The subunit representation of the current decimal as a bigint.
   */
  toSubunits(): bigint;

  /**
   * Negates the current decimal value.
   * @returns A new IDecimal instance with the negated value.
   */
  negate(): IDecimal;
}
