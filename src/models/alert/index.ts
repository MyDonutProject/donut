import { AlertType } from './alert-type.enum';

export interface AlertExtraParams {
  title: string;
  message: string;
  type: AlertType;
  params?: Record<string, any>;
}
