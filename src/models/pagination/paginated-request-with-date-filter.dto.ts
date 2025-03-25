import { PaginatedRequest } from './paginated-request';

export type PaginatedRequestWithDateFilter = PaginatedRequest & {
  startDate: string;
  endDate: string;
};
