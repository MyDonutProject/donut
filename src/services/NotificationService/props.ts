import { AlertExtraParams } from '@/models/alert';

export interface IAddNotification extends AlertExtraParams   {
  duration?: number;
}
