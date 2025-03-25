import { InfiniteData, QueryKey, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { PaginatedResponse } from '@/models/pagination/paginated-response.dto';
import { Comparator } from '@/interfaces/comparator';
/**
 * Custom hook to add a new record to an infinite query.
 * This hook provides a function that updates the cached data of an infinite query
 * by adding a new record to the first page of the data.
 *
 * @template T - The type of the record, which must include an 'id' of type bigint.
 * @param {QueryKey} queryKey - The key of the query to update.
 * @returns {(record: T, comparator?: Comparator<T>) => void} - A function to add a new record to the infinite query.
 *
 * @example
 * const addRecord = useAddNewRecordToInfiniteQuery<MyRecordType>(['myQueryKey']);
 * addRecord({ id: 123n, name: 'New Record' }, (a, b) => a.id - b.id);
 */
export function useAddNewRecordToInfiniteQuery<T extends { id: bigint }>(
  queryKey: QueryKey,
): (record: T, comparator?: Comparator<T>) => void {
  // Access the query client to interact with the query cache
  const queryClient = useQueryClient();

  /**
   * Checks if a new record already exists in the current page of records.
   *
   * @param {T[]} records - The list of current records.
   * @param {T} record - The new record to check.
   * @returns {boolean} - True if the record is already in the page, false otherwise.
   */
  const isNewRecordInPage = useCallback((records: T[], record: T): boolean => {
    return !!records.find(round => round.id === record.id);
  }, []);

  /**
   * Updates the cached pages of the query by adding a new record to the first page.
   * If a comparator is provided, the records are sorted after adding the new record.
   *
   * @param {T} record - The new record to add.
   * @param {InfiniteData<PaginatedResponse<T>>} cachedPages - The current cached pages of the query.
   * @param {Comparator<T>} [comparator] - Optional comparator function to sort the records.
   * @returns {InfiniteData<PaginatedResponse<T>>} - The updated cached pages.
   */
  const updateQueriesData = useCallback(
    (
      record: T,
      cachedPages: InfiniteData<PaginatedResponse<T>>,
      comparator?: Comparator<T>,
    ) => {
      if (!cachedPages || !record) {
        return cachedPages;
      }

      let firstPage: PaginatedResponse<T> = { ...cachedPages.pages?.[0] };

      if (isNewRecordInPage(firstPage.data, record)) {
        return cachedPages;
      }

      firstPage.data.unshift(record);

      if (comparator) {
        firstPage.data.sort(comparator);
      }

      let updatedPages: PaginatedResponse<T>[] = [...cachedPages.pages];
      updatedPages.splice(0, 1, firstPage);

      return {
        ...cachedPages,
        pages: updatedPages,
      };
    },
    [isNewRecordInPage],
  );

  /**
   * Function to add a new record to the infinite query.
   * It updates the query's cached data by adding the new record to the first page.
   *
   * @param {T} record - The new record to add.
   * @param {Comparator<T>} [comparator] - Optional comparator function to sort the records.
   */
  const addNewRecordToInfiniteQuery = useCallback(
    (record: T, comparator?: Comparator<T>) => {
      queryClient.setQueriesData<InfiniteData<PaginatedResponse<T>>>(
        {
          queryKey,
        },
        pages => updateQueriesData(record, pages, comparator),
      );
    },
    [queryClient, updateQueriesData],
  );

  return addNewRecordToInfiniteQuery;
}
