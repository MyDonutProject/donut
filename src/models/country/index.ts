import { BaseEntity } from '../base-entity';
import { CountryIdType } from './id';

export class Country extends BaseEntity {
  id: CountryIdType;
  name: string;
  code: string;
  code3: string;
  dialCode: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
