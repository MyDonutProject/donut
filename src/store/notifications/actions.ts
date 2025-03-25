import {
  AddNotificationPayload,
  NotificationsActions,
  RemoveNotificationPayload,
  SetSocketConnectionPayload,
  SetTabPayload,
} from './props';

export function setNotificationModalTab(tab: string): SetTabPayload {
  return {
    type: NotificationsActions.SetTab,
    payload: tab,
  };
}

export function addNotificationToasty<T>(
  notification: any,
): AddNotificationPayload<T> {
  return {
    type: NotificationsActions.AddNotification,
    payload: notification,
  };
}

export function removeNotificationToasty(
  id: number | bigint,
): RemoveNotificationPayload {
  return {
    type: NotificationsActions.RemoveNotification,
    payload: id,
  };
}

export function setNotificationsSocketConnection(
  connected: boolean,
): SetSocketConnectionPayload {
  return {
    type: NotificationsActions.SetSocketConnection,
    payload: connected,
  };
}
