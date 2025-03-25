import { Metadata } from './metadata';

export class PaginatedResponse<T> {
  data: T[];
  metadata: Metadata;
}
