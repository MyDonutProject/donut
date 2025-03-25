import { FieldPath, FieldValues } from 'react-hook-form';
import { Order } from './props';


export function get<T extends FieldValues, K extends FieldPath<T>>(
  object: T,
  path: K,
): T[K] {
  const keys = path.split('.') as (keyof T)[];
  let result: T | T[K] = object;

  for (const key of keys) {
    result = result?.[key];
  }

  return result as T[K];
}


/**
 * Comparator function for sorting objects based on a specified field path
 *
 * @template T - Type extending FieldValues for object structure
 * @param {T} a - First object to compare
 * @param {T} b - Second object to compare
 * @param {Order} order - Sort order (ASC or DESC)
 * @param {FieldPath<T>} orderBy - Field path to sort by
 * @returns {number} Comparison result (-1, 0, or 1)
 *
 * @example
 * interface User extends FieldValues {
 *   name: string;
 *   age: number;
 * }
 *
 * const user1: User = { name: "John", age: 30 };
 * const user2: User = { name: "Jane", age: 25 };
 *
 * // Sort by age ascending
 * getComparator(user1, user2, Order.ASC, "age"); // Returns 1
 *
 * // Sort by name descending
 * getComparator(user1, user2, Order.DESC, "name"); // Returns -1
 */
function getComparator<T extends FieldValues>(
  a: T,
  b: T,
  order: Order,
  orderBy: FieldPath<T>,
): number {
  const valueA = get(a, orderBy);
  const valueB = get(b, orderBy);

  if (valueA === undefined || valueB === undefined) {
    return 0;
  }

  let comparison = 0;

  if (valueA < valueB) {
    comparison = -1;
  } else if (valueA > valueB) {
    comparison = 1;
  }

  return order === Order.DESC ? comparison * -1 : comparison;
}

/**
 * Performs a stable sort on an array of objects based on a specified field
 *
 * @template T - Type extending FieldValues for array elements
 * @param {T[]} array - Array to sort
 * @param {Order} order - Sort order (ASC or DESC)
 * @param {FieldPath<T> | null} orderBy - Field path to sort by
 * @returns {T[]} New sorted array
 *
 * @example
 * interface User extends FieldValues {
 *   name: string;
 *   age: number;
 * }
 *
 * const users: User[] = [
 *   { name: "John", age: 30 },
 *   { name: "Jane", age: 25 },
 *   { name: "Bob", age: 35 }
 * ];
 *
 * // Sort by age ascending
 * stableSort(users, Order.ASC, "age");
 * // Returns: [
 * //   { name: "Jane", age: 25 },
 * //   { name: "John", age: 30 },
 * //   { name: "Bob", age: 35 }
 * // ]
 */
export function stableSort<T extends FieldValues>(
  array: T[],
  order: Order,
  orderBy: FieldPath<T> | null,
) {
  if (!orderBy) {
    return array;
  }

  return [...array].sort((a, b) => getComparator(a, b, order, orderBy));
}
