export class BaseEntity {
  id: bigint;
  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}
