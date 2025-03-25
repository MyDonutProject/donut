import { Country } from '@/models/country';

export interface CountrySessionsOutputDto extends Country {
  sessionCount: number;
}
