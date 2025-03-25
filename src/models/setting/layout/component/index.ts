import { BaseEntity } from '@/models/base-entity';
import {
  SettingLayoutComponentId,
  SettingLayoutComponentIdType,
} from './componentId.enum';
import { SettingLayoutComponentType } from './type';

export class SettingLayoutComponent extends BaseEntity {
  id: SettingLayoutComponentIdType;
  name: string;
  image: string;
  type: SettingLayoutComponentType;
}

export { SettingLayoutComponentId };
