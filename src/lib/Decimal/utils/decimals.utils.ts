
import {
  DecimalOptions,
  DecimalOverrideProps,
  IDecimal,
  Numeric,
  SerializedDecimal,
} from '../interfaces';
import { GenerateDecimalOptionsFactory } from './generate-decimal-options.utils';
import { Either } from '@/interfaces/either';
import { Nullable } from '@/interfaces/nullable';
import { PartialExcept } from '@/lib/Decimal/interfaces/partial-except';
/**
 * Class representing a Decimal with specific scaling and precision options.
 * Implements the IDecimal interface.
 */
export class Decimal implements IDecimal {
  /**
   * Configuration options for the Decimal instance.
   * Includes properties like scale and highScale.
   */
  readonly #options: DecimalOptions;

  /**
   * The scale factor used for scaling the numeric value.
   * Calculated as 10 raised to the power of the scale.
   */
  readonly #scaleFactor: number;

  /**
   * The high scale factor used for higher precision calculations.
   * Calculated as 10 raised to the power of the highScale, represented as a BigInt.
   */
  readonly #highScaleFactor: bigint;

  /**
   * The amount in subunits, stored as a BigInt.
   * This represents the value of the Decimal instance in the smallest units.
   */
  public subunits: bigint;

  /**
   * The scale used for the Decimal instance.
   * This determines the number of decimal places for the value.
   */
  public readonly scale: number;

  /**
   * Creates a new Decimal instance with a specific value and optional configuration.
   *
   * @param {Numeric} amount - The numeric value to initialize the Decimal.
   * @param {Partial<DecimalOptions>} [options] - Optional configuration for scaling and precision.
   */
  constructor(amount: Numeric, options?: Partial<DecimalOptions>) {
    this.#options = GenerateDecimalOptionsFactory.generate(options);

    this.scale = this.#options.scale;
    this.#scaleFactor = Math.pow(10, this.scale);
    this.#highScaleFactor = BigInt(Math.pow(10, this.#options.highScale));

    const amountInSubunits: bigint = Decimal.parseToSubunits(
      amount,
      this.scale,
    );

    this.subunits = amountInSubunits;
  }

  /**
   * Custom implementation of the `toStringTag` symbol.
   * This allows the Decimal instance to be identified as 'Decimal' when using Object.prototype.toString.call.
   *
   * @returns {string} - The string 'Decimal'.
   */
  get [Symbol.toStringTag]() {
    return 'Decimal';
  }

  toString(): string {
    return `Decimal { subunits: "${this.toSubunits()?.toString()}", scale: ${this.scale} }`;
  }

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `Decimal { subunits: "${this.toSubunits()?.toString()}", scale: ${this.scale} }`;
  }

  /**
   * Adds a value to the current Decimal instance.
   *
   * @param {Either<Numeric, Decimal>} value - The value to add, either numeric or another Decimal instance.
   * @returns {Decimal} - The updated Decimal instance.
   */
  public add(value: Either<Numeric, Decimal>): Decimal {
    // Initialize the value instance with the provided value
    let valueInstance: Either<Numeric, Decimal> = value;

    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (
      valueInstance instanceof Decimal &&
      this.scale !== valueInstance.scale
    ) {
      // Throw an error indicating that the scales must be the same
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    // Parse the value instance to subunits using the current instance's scale
    let valueInSubUnits: bigint = Decimal.parseToSubunits(
      valueInstance,
      this.scale,
    );
    // Calculate the total in subunits by adding the parsed value to the current amount in subunits
    const totalInSubUnits: bigint = this.subunits + valueInSubUnits;

    // Update the current amount in subunits with the calculated total
    this.subunits = totalInSubUnits;

    // Return the updated Decimal instance
    return this;
  }

  /**
   * Subtracts a value from the current Decimal instance.
   *
   * @param {Either<Numeric, Decimal>} value - The value to subtract, either numeric or another Decimal instance.
   * @returns {Decimal} - The updated Decimal instance.
   */
  public sub(value: Either<Numeric, Decimal>): Decimal {
    // Initialize the value instance with the provided value
    let valueInstance: Either<Numeric, Decimal> = value;

    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (
      valueInstance instanceof Decimal &&
      this.scale !== valueInstance.scale
    ) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[sub] Current scale:',
        this.scale,
        'Value scale:',
        valueInstance.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    // Parse the value instance to subunits using the current instance's scale
    let valueInSubUnits: bigint = Decimal.parseToSubunits(
      valueInstance,
      this.scale,
    );
    // Calculate the total in subunits by subtracting the parsed value from the current amount in subunits
    const totalInSubUnits: bigint = this.subunits - valueInSubUnits;

    // Update the current amount in subunits with the calculated total
    this.subunits = totalInSubUnits;

    return this;
  }

  /**
   * Divides the current Decimal instance by the specified divisor.
   *
   * @param {Either<Numeric, Decimal>} divisor - The value by which to divide, either numeric or another Decimal instance.
   * @returns {Decimal} - The updated Decimal instance after division.
   */
  public divide(divisor: Either<Numeric, Decimal>): Decimal {
    // Initialize the divisor instance with the provided divisor value
    let divisorInstance: Either<Numeric, Decimal> = divisor;

    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (
      divisorInstance instanceof Decimal &&
      this.scale !== divisorInstance.scale
    ) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[divide] Current scale:',
        this.scale,
        'Divisor scale:',
        divisorInstance.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    // Parse the divisor instance to subunits using the high scale
    let scaledDivisor: bigint = Decimal.parseToSubunits(
      divisorInstance,
      this.#options.highScale,
    );

    // Convert the current amount to subunits
    const amountInSubunits: bigint = this.toSubunits();

    // Calculate the result in subunits by multiplying the amount in subunits with the high scale factor
    // and then dividing by the scaled divisor
    const resultInSubUnits: bigint =
      (amountInSubunits * this.#highScaleFactor) / scaledDivisor;

    // Update the current amount in subunits with the result
    this.subunits = resultInSubUnits;

    // Return the updated Decimal instance
    return this;
  }

  /**
   * Multiplies the current Decimal instance by the specified multiplier.
   *
   * @param {Either<Numeric, Decimal>} multiplier - The value to multiply with, either numeric or another Decimal instance.
   * @returns {Decimal} - The updated Decimal instance after multiplication.
   */
  public multiply(multiplier: Either<Numeric, Decimal>): Decimal {
    // Initialize the multiplier instance with the provided multiplier value
    let multiplierInstance: Either<Numeric, Decimal> = multiplier;

    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (
      multiplierInstance instanceof Decimal &&
      this.scale !== multiplierInstance.scale
    ) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[multiply] Current scale:',
        this.scale,
        'Multiplier scale:',
        multiplierInstance.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    // Parse the multiplier instance to subunits using the high scale
    let scaledMultiplier: bigint = Decimal.parseToSubunits(
      multiplierInstance,
      this.#options.highScale,
    );

    // Convert the current amount to subunits
    const amountInSubunits: bigint = this.toSubunits();

    // Calculate the result in subunits by multiplying the amount in subunits with the scaled multiplier
    // and then dividing by the high scale factor
    const resultInSubUnits: bigint =
      (amountInSubunits * scaledMultiplier) / this.#highScaleFactor;

    // Update the current amount in subunits with the result
    this.subunits = resultInSubUnits;

    // Return the updated Decimal instance
    return this;
  }
  /**
   * Checks if the current Decimal instance is equal to a given value.
   *
   * @param {Either<Numeric, Decimal>} value - The value to compare, either numeric or another Decimal instance.
   * @returns {boolean} - True if the values are equal, otherwise false.
   */
  public equals(value: Either<Numeric, Decimal>): boolean {
    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (value instanceof Decimal && this.scale !== value.scale) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[equals] Current scale:',
        this.scale,
        'Value scale:',
        value.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    let valueInSubUnits: bigint = Decimal.parseToSubunits(value, this.scale);
    const amountInSubunits: bigint = this.toSubunits();

    return valueInSubUnits === amountInSubunits;
  }

  /**
   * Checks if the current Decimal instance is greater than a given value.
   *
   * @param {Either<Numeric, Decimal>} value - The value to compare, either numeric or another Decimal instance.
   * @returns {boolean} - True if the current value is greater, otherwise false.
   */
  public greater(value: Either<Numeric, Decimal>): boolean {
    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (value instanceof Decimal && this.scale !== value.scale) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[greater] Current scale:',
        this.scale,
        'Value scale:',
        value.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }
    let valueInSubUnits: bigint = Decimal.parseToSubunits(value, this.scale);

    const amountInSubunits: bigint = this.toSubunits();

    return amountInSubunits > valueInSubUnits;
  }

  /**
   * Checks if the current Decimal instance is greater than or equal to a given value.
   *
   * @param {Either<Numeric, Decimal>} value - The value to compare, either numeric or another Decimal instance.
   * @returns {boolean} - True if the current value is greater or equal, otherwise false.
   */
  public greaterOrEquals(value: Either<Numeric, Decimal>): boolean {
    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (value instanceof Decimal && this.scale !== value.scale) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[greaterOrEquals] Current scale:',
        this.scale,
        'Value scale:',
        value.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    let valueInSubUnits: bigint = Decimal.parseToSubunits(value, this.scale);
    const amountInSubunits: bigint = this.toSubunits();

    return amountInSubunits >= valueInSubUnits;
  }

  /**
   * Checks if the current Decimal instance is less than a given value.
   *
   * @param {Either<Numeric, Decimal>} value - The value to compare, either numeric or another Decimal instance.
   * @returns {boolean} - True if the current value is less, otherwise false.
   */
  public less(value: Either<Numeric, Decimal>): boolean {
    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (value instanceof Decimal && this.scale !== value.scale) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[less] Current scale:',
        this.scale,
        'Value scale:',
        value.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    let valueInSubUnits: bigint = Decimal.parseToSubunits(value, this.scale);
    const amountInSubunits: bigint = this.toSubunits();

    return amountInSubunits < valueInSubUnits;
  }

  /**
   * Checks if the current Decimal instance is less than or equal to a given value.
   *
   * @param {Either<Numeric, Decimal>} value - The value to compare, either numeric or another Decimal instance.
   * @returns {boolean} - True if the current value is less or equal, otherwise false.
   */
  public lessOrEquals(value: Either<Numeric, Decimal>): boolean {
    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (value instanceof Decimal && this.scale !== value.scale) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[lessOrEquals] Current scale:',
        this.scale,
        'Value scale:',
        value.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    let valueInSubUnits: bigint = Decimal.parseToSubunits(value, this.scale);
    const amountInSubunits: bigint = this.toSubunits();

    return amountInSubunits <= valueInSubUnits;
  }

  /**
   * Clamps the current Decimal instance between a minimum and maximum value.
   *
   * @param {Either<Numeric, Decimal>} min - The minimum value.
   * @param {Either<Numeric, Decimal>} max - The maximum value.
   * @returns {Decimal} - The clamped Decimal instance.
   */
  public clamp(
    min: Either<Numeric, Decimal>,
    max: Either<Numeric, Decimal>,
  ): Decimal {
    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (
      min instanceof Decimal &&
      max instanceof Decimal &&
      (min.scale !== max.scale ||
        min.scale !== this.scale ||
        max.scale !== this.scale)
    ) {
      // Throw an error indicating that the scales must be the same
      console.log('[clamp] Min scale:', min.scale, 'Max scale:', max.scale);
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    const amountInSubunits: bigint = this.toSubunits();
    const minInSubUnits: bigint = Decimal.parseToSubunits(min, this.scale);

    if (amountInSubunits < minInSubUnits) {
      this.subunits = minInSubUnits;
    } else {
      const maxInSubUnits: bigint = Decimal.parseToSubunits(max, this.scale);

      if (amountInSubunits > maxInSubUnits) {
        this.subunits = maxInSubUnits;
      }
    }

    return this;
  }

  /**
   * Calculates the absolute difference between the current Decimal instance and a given value.
   *
   * @param {Either<Numeric, Decimal>} value - The value to calculate the difference with.
   * @returns {Decimal} - A new Decimal instance representing the difference.
   */
  public diff(value: Either<Numeric, Decimal>): Decimal {
    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (value instanceof Decimal && this.scale !== value.scale) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[diff] Current scale:',
        this.scale,
        'Value scale:',
        value.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    let valueInSubUnits: bigint = Decimal.parseToSubunits(value, this.scale);
    const amountInSubunits: bigint = this.toSubunits();
    const differenceInSubUnits: bigint =
      amountInSubunits > valueInSubUnits
        ? amountInSubunits - valueInSubUnits
        : valueInSubUnits - amountInSubunits;

    return Decimal.fromSubunits(differenceInSubUnits, this.#options);
  }

  /**
   * Calculates a percentage of the current Decimal instance.
   *
   * @param {Either<Numeric, Decimal>} value - The percentage to calculate.
   * @returns {Decimal} - The updated Decimal instance.
   */
  public percentage(value: Either<Numeric, Decimal>): Decimal {
    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (value instanceof Decimal && this.scale !== value.scale) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[percentage] Current scale:',
        this.scale,
        'Value scale:',
        value.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    this.divide(100).multiply(value);
    return this;
  }

  /**
   * Checks if the current Decimal instance is strictly between two values.
   *
   * @param {Either<Numeric, Decimal>} lower - The lower bound.
   * @param {Either<Numeric, Decimal>} upper - The upper bound.
   * @returns {boolean} - True if the value is between the bounds, otherwise false.
   */
  public isBetween(
    lower: Either<Numeric, Decimal>,
    upper: Either<Numeric, Decimal>,
  ): boolean {
    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (lower instanceof Decimal && this.scale !== lower.scale) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[isBetween] Current scale:',
        this.scale,
        'Lower scale:',
        lower.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (upper instanceof Decimal && this.scale !== upper.scale) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[isBetween] Current scale:',
        this.scale,
        'Upper scale:',
        upper.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    const lowerInSubUnits: bigint = Decimal.parseToSubunits(lower, this.scale);
    const upperInSubUnits: bigint = Decimal.parseToSubunits(upper, this.scale);
    const amountInSubunits: bigint = this.toSubunits();

    return (
      amountInSubunits > lowerInSubUnits && amountInSubunits < upperInSubUnits
    );
  }

  /**
   * Checks if the current Decimal instance is within or equal to two bounds.
   *
   * @param {Either<Numeric, Decimal>} lower - The lower bound.
   * @param {Either<Numeric, Decimal>} upper - The upper bound.
   * @returns {boolean} - True if the value is within or equal to the bounds, otherwise false.
   */
  public isWithin(
    lower: Either<Numeric, Decimal>,
    upper: Either<Numeric, Decimal>,
  ): boolean {
    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (lower instanceof Decimal && this.scale !== lower.scale) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[isWithin] Current scale:',
        this.scale,
        'Lower scale:',
        lower.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    // Check if the value is a Decimal instance and if its scale is different from the current instance's scale
    if (upper instanceof Decimal && this.scale !== upper.scale) {
      // Throw an error indicating that the scales must be the same
      console.log(
        '[isWithin] Current scale:',
        this.scale,
        'Upper scale:',
        upper.scale,
      );
      throw new Error('The scales of the Decimal instances must be the same.');
    }

    const lowerInSubUnits: bigint = Decimal.parseToSubunits(lower, this.scale);
    const upperInSubUnits: bigint = Decimal.parseToSubunits(upper, this.scale);
    const amountInSubunits: bigint = this.toSubunits();

    return (
      amountInSubunits >= lowerInSubUnits && amountInSubunits <= upperInSubUnits
    );
  }

  /**
   * Checks if the current Decimal instance is positive.
   *
   * @returns {boolean} - True if the value is positive, otherwise false.
   */
  public isPositive(): boolean {
    const amountInSubunits: bigint = this.toSubunits();
    return amountInSubunits > BigInt(0);
  }

  /**
   * Checks if the current Decimal instance is negative.
   *
   * @returns {boolean} - True if the value is negative, otherwise false.
   */
  public isNegative(): boolean {
    const amountInSubunits: bigint = this.toSubunits();
    return amountInSubunits < BigInt(0);
  }

  /**
   * Checks if the current Decimal instance is zero.
   *
   * @returns {boolean} - True if the value is zero, otherwise false.
   */
  public isZero(): boolean {
    const amountInSubunits: bigint = this.toSubunits();
    return amountInSubunits === BigInt(0);
  }

  /**
   * Sums up an array of values and sets the result in the current Decimal instance.
   *
   * @param {Array<Either<Numeric, Decimal>>} items - The array of values to sum.
   * @returns {Decimal} - A new Decimal instance representing the total sum.
   */
  public sum(items: Array<Either<Numeric, Decimal>>): Decimal {
    const itemsInSubUnits: Array<bigint> = items.map(
      (item: Either<Numeric, Decimal>) =>
        Decimal.parseToSubunits(item, this.scale),
    );
    const totalInSubUnits: bigint = itemsInSubUnits.reduce(
      (sum: bigint, current: bigint) => sum + current,
      BigInt(0),
    );

    return Decimal.fromSubunits(totalInSubUnits, this.#options);
  }

  /**
   * Finds the highest value in an array of values.
   *
   * @param {Array<Either<Numeric, Decimal>>} items - The array of values to check.
   * @returns {Nullable<Decimal>} - The highest value as a Decimal, or null if the array is empty.
   */
  public highest(items: Array<Either<Numeric, Decimal>>): Nullable<Decimal> {
    if (items.length === 0) {
      return null;
    }

    const itemsInSubUnits: Array<bigint> = items.map(
      (item: Either<Numeric, Decimal>) =>
        Decimal.parseToSubunits(item, this.scale),
    );

    let highestItemInSubUnit: bigint = itemsInSubUnits[0];

    for (const item of itemsInSubUnits) {
      if (item > highestItemInSubUnit) {
        highestItemInSubUnit = item;
      }
    }

    return Decimal.fromSubunits(highestItemInSubUnit, this.#options);
  }

  /**
   * Finds the lowest value in an array of values.
   *
   * @param {Array<Either<Numeric, Decimal>>} items - The array of values to check.
   * @returns {Nullable<Decimal>} - The lowest value as a Decimal, or null if the array is empty.
   */
  public lowest(items: Array<Either<Numeric, Decimal>>): Nullable<Decimal> {
    if (items.length === 0) {
      return null;
    }

    const itemsInSubUnits: Array<bigint> = items.map(
      (item: Either<Numeric, Decimal>) =>
        Decimal.parseToSubunits(item, this.scale),
    );

    let lowestItemInSubUnit: bigint = itemsInSubUnits[0];

    for (const item of itemsInSubUnits) {
      if (item < lowestItemInSubUnit) {
        lowestItemInSubUnit = item;
      }
    }

    return Decimal.fromSubunits(lowestItemInSubUnit, this.#options);
  }

  /**
   * Creates a copy of the current Decimal instance with optional overridden properties.
   *
   * @param {Partial<DecimalOverrideProps>} [overrides] - Optional overrides for amount or options.
   * @returns {Decimal} - A new Decimal instance with the applied overrides.
   */
  public copyWith(overrides?: Partial<DecimalOverrideProps>): Decimal {
    const newAmount: Numeric =
      overrides?.amount !== undefined
        ? overrides?.amount
        : this.toNumberString();
    const newOptions: Partial<DecimalOptions> = overrides?.options
      ? { ...this.#options, ...overrides.options }
      : this.#options;

    return new Decimal(newAmount, newOptions);
  }

  /**
   * Converts the current Decimal instance to a numeric value.
   *
   * @returns {number} - The numeric value of the Decimal instance.
   */
  public toNumber(): number {
    return Number(this.subunits) / this.#scaleFactor;
  }

  /**
   * Converts the current Decimal instance to a string, ensuring the correct precision.
   *
   * @returns {string} - The string representation of the Decimal value.
   */
  public toNumberString(): string {
    let subunitString: string = this.subunits.toString();

    // Handle cases where subunitString length is less than decimalPlaces
    if (subunitString.length <= this.scale) {
      // Pad with leading zeros if necessary
      subunitString = subunitString.padStart(this.scale + 1, '0');
    }

    // Split into integer and fractional parts
    const integerPart: string = subunitString.slice(0, -this.scale) || '0';
    const fractionalPart: string = subunitString.slice(-this.scale);

    // Combine integer and fractional parts with a decimal point
    const result: string = `${integerPart}.${fractionalPart}`;
    const amountAsString: string = result.replace(/\.?0+$/, '');

    return amountAsString;
  }

  /**
   * Converts the current Decimal instance to its subunit representation.
   *
   * @returns {bigint} - The subunit value of the Decimal instance.
   */
  public toSubunits(): bigint {
    return this.subunits;
  }

  /**
   * Returns a JSON representation of the current Decimal instance.
   *
   * @returns {SerializedDecimal} - The JSON representation of the Decimal instance.
   */
  public toJSON(): SerializedDecimal {
    return {
      type: 'decimal',
      value: this.subunits.toString(),
      scale: this.scale,
    };
  }

  /**
   * Parses a numeric or Decimal value to its subunit representation.
   *
   * @param {Either<Numeric, Decimal>} amount - The value to parse.
   * @param {number} scale - The scale to use for parsing.
   * @returns {bigint} - The subunit representation of the value.
   */
  public static parseToSubunits(
    amount: Either<Numeric, Decimal>,
    scale: number,
  ): bigint {
    // Convert amount to string, handling undefined/null
    if (amount === undefined || amount === null) {
      throw new Error('Amount cannot be undefined or null');
    }

    // Initialize a variable to hold the string representation of the input amount.
    let numberString: Nullable<string> = null;

    // If the input is an instance of Decimal, use its custom toNumberString() method.
    if (amount instanceof Decimal) {
      numberString = amount.toNumberString();
    } else {
      // Otherwise, if the input is a string, use it directly; if not, convert it to a string.
      numberString = typeof amount === 'string' ? amount : amount.toString();
    }

    // Validate the number string
    if (
      numberString === 'NaN' ||
      numberString === 'Infinity' ||
      numberString === '-Infinity'
    ) {
      throw new Error('Invalid number: ' + numberString);
    }

    // Parse scientific notation numbers if present
    if (numberString.toLowerCase().includes('e')) {
      const [base, expStr] = numberString.toLowerCase().split('e');
      const exponent = parseInt(expStr, 10);
      let [intPart, fracPart] = base.split('.');
      if (fracPart === undefined) {
        fracPart = '';
      }
      const combinedDigits = intPart + fracPart;
      const decimalPosition = intPart.length + exponent;
      if (decimalPosition <= 0) {
        numberString =
          '0.' + '0'.repeat(Math.abs(decimalPosition)) + combinedDigits;
      } else if (decimalPosition >= combinedDigits.length) {
        numberString =
          combinedDigits + '0'.repeat(decimalPosition - combinedDigits.length);
      } else {
        numberString =
          combinedDigits.slice(0, decimalPosition) +
          '.' +
          combinedDigits.slice(decimalPosition);
      }
    }

    const isNegative = numberString.startsWith('-');
    if (isNegative) {
      numberString = numberString.slice(1); // Remove o '-'
    }

    const [integerPart, fractionalPart = ''] = numberString.split('.');

    const cleanedIntegerPart = integerPart.replace(/^0+/, '') || '0';

    const adjustedFractionalPart = fractionalPart
      .replace(/[^0-9]/g, '')
      .padEnd(scale, '0')
      .slice(0, scale);

    const combined = cleanedIntegerPart + adjustedFractionalPart;

    try {
      return isNegative ? -BigInt(combined) : BigInt(combined);
    } catch (error) {
      throw new Error(
        `Failed to convert to BigInt: ${isNegative ? '-' : ''}${combined}`,
      );
    }
  }
  /**
   * Creates a Decimal instance from a subunit value.
   *
   * @param {Numeric} amountInSubunits - The subunit value.
   * @param {PartialExcept<DecimalOptions, 'scale'>} [options] - The options for the Decimal instance.
   * @returns {Decimal} - A new Decimal instance.
   */
  public static fromSubunits(
    amountInSubunits: Either<bigint, string>,
    options?: PartialExcept<DecimalOptions, 'scale'>,
  ): Decimal {
    const fullOptions: PartialExcept<DecimalOptions, 'scale'> =
      GenerateDecimalOptionsFactory.generate(options);

    let subunitString: string =
      typeof amountInSubunits === 'string'
        ? amountInSubunits
        : (amountInSubunits ?? 0n).toString();

    // Handle cases where subunitString length is less than decimalPlaces
    if (subunitString.length <= fullOptions.scale) {
      // Pad with leading zeros if necessary
      subunitString = subunitString.padStart(fullOptions.scale + 1, '0');
    }

    // Split into integer and fractional parts
    const integerPart: string =
      subunitString.slice(0, -fullOptions.scale) || '0';
    const fractionalPart: string = subunitString.slice(-fullOptions.scale);

    // Combine integer and fractional parts with a decimal point
    const result: string = `${integerPart}.${fractionalPart}`;
    const amountAsString: string = result.replace(/\.?0+$/, '');

    // Remove trailing zeros from the fractional part and any trailing dot
    return new Decimal(amountAsString, fullOptions);
  }

  /**
   * Creates a new Decimal instance with the negated value of the current instance.
   *
   * @returns {Decimal} A new Decimal instance with the negated value
   */
  public negate(): Decimal {
    return this.copyWith().multiply(-1);
  }
}
