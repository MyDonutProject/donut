import { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CountriesQueryKeys } from '../../enums';
import { AxiosError } from 'axios';
import { PaginatedResponse } from '@/models/pagination/paginated-response.dto';
import { UseCountriesProps, UseCountriesQueryKeyProps } from './props';
  import { Country } from '@/models/country';
import { fetchCountries } from './service';
import { useEffect, useMemo } from 'react';
import { FetchCountriesInputDto } from '@/dto/countries/fetch-countries-input.dto';
import { Either } from '@/interfaces/either';
import { useInfiniteQueryCallbacks } from '@/hooks/infiniteQuery/useInfiniteQueryCallbacks';
import { GenericError } from '@/models/generic-error';

export function useCountries(options?: UseCountriesProps) {
  const { query, fetchAll } = options ?? {};

  const filter: FetchCountriesInputDto = {
    limit: 50,
    query: query ?? '',
  };

  const queryKey: UseCountriesQueryKeyProps = [
    CountriesQueryKeys.Countries,
    filter,
  ];

  const { getNextPageParam, getPreviousPageParam } =
    useInfiniteQueryCallbacks();

  const {
    data,
    isFetching,
    hasNextPage,
    error,
    fetchNextPage,
    ...infiniteQuery
  } = useInfiniteQuery<
    PaginatedResponse<Country>,
      AxiosError<GenericError>,
    InfiniteData<PaginatedResponse<Country>>,
    UseCountriesQueryKeyProps
  >({
    queryKey,
    getNextPageParam,
    staleTime: Infinity,
    initialPageParam: 1,
    getPreviousPageParam,
    queryFn: fetchCountries,
  });

  const countries: Either<Country[], undefined> = useMemo(
    () => data?.pages?.flatMap(page => page.data),
    [data],
  );

  function handleFetchAllCountries() {
    if (isFetching || !hasNextPage || error || !fetchAll) {
      return;
    }

    setTimeout(() => {
      fetchNextPage();
    }, 500);
  }

  useEffect(handleFetchAllCountries, [
    isFetching,
    hasNextPage,
    fetchNextPage,
    error,
    fetchAll,
  ]);

  return {
    ...infiniteQuery,
    countries,
    isFetching,
    hasNextPage,
    error,
    fetchNextPage,
  };
}
