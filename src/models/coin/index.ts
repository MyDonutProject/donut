import { BaseEntity } from '../base-entity';

export class Coin extends BaseEntity {
  id: bigint;
  name: string;
  code: string;
  symbol: string;
  image: string;
  decimals: number;
  locale: string;
  active: boolean;
}
