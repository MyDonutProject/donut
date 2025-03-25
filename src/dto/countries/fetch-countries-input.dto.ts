import { PaginatedRequest } from "@/models/pagination";

export interface FetchCountriesInputDto extends PaginatedRequest {
  query?: string;
}
