export enum NotificationRowType {
  Toasty = 'Toasty',
  Row = 'Row',
}
import { TransProps } from 'react-i18next';

export interface BaseContentProps {
  icon: string;
  title: string;
  isError?: boolean;
  createdAt: string;
  description: string;
  type: NotificationRowType;
  extra: any;
  components?: any;
  notificationTypeId: any;
}

export interface NotificationRowProps {
  notification: any;
  type: NotificationRowType;
}
