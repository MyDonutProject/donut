/**
 * Creates a partial type of T, excluding the specified keys K.
 *
 * @param T - The original type to create a partial type from.
 * @param K - The keys to exclude from the partial type.
 * @returns A partial type of T, excluding the specified keys K.
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
