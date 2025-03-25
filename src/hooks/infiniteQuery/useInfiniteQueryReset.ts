import {
  InfiniteData,
  QueryClient,
  QueryKey,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';

/**
 * Custom hook to reset an infinite query's cache to only the first page upon component unmount.
 *
 * @param queryKey - The key of the query to reset. It is used to identify the query in the cache.
 */
export function useInfiniteQueryReset(queryKey: QueryKey) {
  // Get the query client instance from the context
  const queryClient: QueryClient = useQueryClient();

  /**
   * Function to clear the cache and retain only the first page of data.
   *
   * @param oldData - The existing data in the cache, which is of type InfiniteData.
   * @returns An object containing only the first page and its parameters, or undefined if no data exists.
   *
   * Example:
   * If oldData is:
   * {
   *   pages: [[1, 2, 3], [4, 5, 6]],
   *   pageParams: [null, { page: 2 }]
   * }
   *
   * The function will return:
   * {
   *   pages: [[1, 2, 3]],
   *   pageParams: [null]
   * }
   */
  function clearCacheToOnlyFirstPage(oldData?: InfiniteData<unknown>) {
    if (!oldData) {
      return;
    }

    return {
      pages: [oldData.pages?.[0]],
      pageParams: [oldData.pageParams?.[0]],
    };
  }

  /**
   * Function to be executed on component unmount.
   * It sets the query data to only the first page using the query client.
   */
  function onUnmount() {
    return () => {
      queryClient.setQueriesData<InfiniteData<unknown>>(
        { queryKey },
        clearCacheToOnlyFirstPage,
      );
    };
  }

  // useEffect hook to perform side effects in function components.
  // Here, it is used to register the onUnmount function to be called when the component unmounts.
  // The empty dependency array ensures this effect runs only once, similar to componentDidMount and componentWillUnmount.
  //eslint-disable-next-line
  useEffect(onUnmount, []);
}
