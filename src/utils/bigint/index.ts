import { Decimal } from '@/lib/Decimal';

export function parseBigIntToString<T>(value: T): T {
  if (typeof value === 'bigint') {
    return value.toString() as T;
  }

  if (Array.isArray(value)) {
    return value.map(parseBigIntToString) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, parseBigIntToString(v)]),
    ) as T;
  }
  return value;
}

export function parseToBigInt<T>(value: T): bigint | T | string | undefined {
  // if (value === undefined) {
  //   return undefined;
  // }

  // if (typeof value === 'bigint') {
  //   return value.toString();
  // }

  // if (typeof value === 'string' || typeof value === 'number') {
  //   try {
  //     return BigInt(value).toString();
  //   } catch {
  //     return value.toString();
  //   }
  // }

  return value;
}

/**
 * Recursively parses data structures, handling arrays, objects with toJSON methods,
 * and nested objects.
 */
export function dataParser<T>(data: T): T {
  // Handle arrays by recursively parsing each element

  if (typeof data === 'object' && data instanceof File) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(dataParser) as T;
  }

  // Handle objects
  if (data !== null && typeof data === 'object') {
    // If object has toJSON method, parse its JSON representation
    if ('toJSON' in data && typeof data.toJSON === 'function') {
      return dataParser(data.toJSON());
    }

    // Recursively parse all object properties
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, dataParser(value)]),
    ) as T;
  }

  // If data is bigint, parse to string
  if (typeof data === 'bigint') {
    return data.toString() as T;
  }

  // Return primitive values as-is
  return data;
}

/**
 * Parses data with special handling for serialized types (Date, Decimal, BigInt).
 * Recursively processes nested arrays and objects.
 */
export function interceptorDataParser<T>(data: T): T {
  if (data === null || typeof data === 'undefined') {
    return data;
  }

  // Handle stringified JSON
  if (typeof data === 'string') {
    try {
      const parsedData = JSON.parse(data);
      return interceptorDataParser(parsedData);
    } catch {
      return data;
    }
  }

  // Prevent double processing if already converted to Decimal
  if (typeof data === 'object' && data instanceof Decimal) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(interceptorDataParser) as T;
  }

  if (typeof data === 'object') {
    if ('type' in data && 'value' in data) {
      const typedData = data as any;

      switch (typedData.type) {
        case 'date': {
          return typedData.value as T;
        }
        case 'decimal': {
          if (
            typeof typedData.value === 'string' &&
            /^-?\d+$/.test(typedData.value) // Updated regex to include negative numbers
          ) {
            const decimal = Decimal.fromSubunits(typedData.value, {
              scale: typedData.scale,
            });

            return (typeof window === 'undefined'
              ? decimal.toJSON()
              : decimal) as unknown as T;
          }

          return data;
        }
        case 'bigint': {
          return typedData.value as T;
        }
      }
      // If type is recognized but none of the switch cases returned,
      // return data immediately instead of processing its keys.
      return data;
    }

    // Process nested properties
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        interceptorDataParser(value),
      ]),
    ) as T;
  }

  return data;
}

export function requestParser<T>(data: T): T {
  if (!data) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(requestParser) as T;
  }

  // Handle objects
  if (typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        key === 'amount' && typeof value !== 'bigint'
          ? BigInt(value as string | number)
          : requestParser(value),
      ]),
    ) as T;
  }

  return data;
}
