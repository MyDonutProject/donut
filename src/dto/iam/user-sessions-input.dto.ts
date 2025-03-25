import { PaginatedRequest } from '@/models/pagination';

export interface UserSessionsInputDto extends PaginatedRequest {
  userId: bigint;
}
