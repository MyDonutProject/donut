import { PaginatedResponse } from "@/models/pagination";

/**
 * Custom hook to provide callback functions for infinite queries.
 * This hook provides functions to get the next and previous page parameters
 * based on the metadata of the paginated response.
 *
 * @template T - The type of the paginated response.
 * @returns {object} - An object containing the getNextPageParam and getPreviousPageParam functions.
 *
 * @example
 * const { getNextPageParam, getPreviousPageParam } = useInfiniteQueryCallbacks<PaginatedResponse<MyDataType>>();
 * const nextPage = getNextPageParam(lastPage);
 * const previousPage = getPreviousPageParam(firstPage);
 */
export function useInfiniteQueryCallbacks<T extends PaginatedResponse<T>>() {
  /**
   * Function to get the next page parameter based on the metadata of the last page.
   *
   * @param {T} lastPage - The last page of the paginated response.
   * @returns {number | null} - The next page number if it exists, otherwise null.
   *
   * @example
   * const nextPage = getNextPageParam(lastPage);
   */
  function getNextPageParam(lastPage: T) {
    if (lastPage?.metadata?.hasNextPage) {
      return lastPage.metadata.page + 1;
    }
    return null;
  }

  /**
   * Function to get the previous page parameter based on the metadata of the first page.
   *
   * @param {T} firstPage - The first page of the paginated response.
   * @returns {number | null} - The previous page number if it exists, otherwise null.
   *
   * @example
   * const previousPage = getPreviousPageParam(firstPage);
   */
  function getPreviousPageParam(firstPage: T) {
    if (firstPage?.metadata?.hasPreviousPage) {
      return firstPage.metadata.page - 1;
    }

    return null;
  }

  // Return the callback functions
  return {
    getNextPageParam,
    getPreviousPageParam,
  };
}
