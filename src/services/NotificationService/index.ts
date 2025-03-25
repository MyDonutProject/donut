
import { AlertExtraParams } from '@/models/alert';
import { AlertType } from '@/models/alert/alert-type.enum';
import {
  addNotificationToasty,
  removeNotificationToasty,
} from '@/store/notifications/actions';
import { generateRandomId } from '@/utils/generateRandomId';
import { Store } from 'redux';

export const NOTIFICATION_DURATION: number = 10000;

export class NotificationsService<T> {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  addNotification(notification: any) {
    this.store.dispatch(addNotificationToasty(notification));

    setTimeout(() => {
      this.store.dispatch(removeNotificationToasty(notification.id));
    }, NOTIFICATION_DURATION);
  }

  remove(id: number): void {
    this.store.dispatch(removeNotificationToasty(id));
  }

  addAlert(alertExtraParams: AlertExtraParams) {
    const id: number = generateRandomId();

    const notification: any = {
      id,
      pinned: false,
      extra: alertExtraParams,
      createdAt: `${new Date()}`,
    };

    this.addNotification(notification);
  }

  info({ title, message, params }: Omit<AlertExtraParams, 'type'>) {
    this.addAlert({
      title,
      message,
      params,
      type: AlertType.Info,
    });
  }

  error({ title, message, params }: Omit<AlertExtraParams, 'type'>) {
    this.addAlert({
      title,
      message,
      params,
      type: AlertType.Error,
    });
  }

  success({ title = '', message, params }: Omit<AlertExtraParams, 'type'>) {
    this.addAlert({
      title,
      message,
      params,
      type: AlertType.Success,
    });
  }
}
