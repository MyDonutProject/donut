import baseAPI from '@/api';
import { QueryFunctionContext } from '@tanstack/react-query';
import { UseCountriesQueryKeyProps } from './props';
import { PaginatedResponse } from '@/models/pagination/paginated-response.dto';
import { Country } from '@/models/country';

export async function fetchCountries({
  queryKey,
  pageParam,
}: QueryFunctionContext<UseCountriesQueryKeyProps>) {
  const { limit, query } = queryKey[1];
  const response = await baseAPI.get<PaginatedResponse<Country>>('countries', {
    params: {
      limit,
      page: pageParam,
      query,
    },
  });

  return response.data;
}
