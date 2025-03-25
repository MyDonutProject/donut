import { CountriesQueryKeys } from '../../enums';
import { FetchCountriesInputDto } from '@/dto/countries/fetch-countries-input.dto';

export type UseCountriesQueryKeyProps = [
  CountriesQueryKeys.Countries,
  FetchCountriesInputDto,
];

export interface UseCountriesProps {
  query?: string;
  fetchAll?: boolean;
}
