
export enum NotificationsActions {
  SetTab = 'notifications/setCurrentTab',
  SetSocketConnection = 'notifications/setSocketConnection',
  AddNotification = 'notifications/addNotification',
  RemoveNotification = 'notifications/removeNotification',
}

export interface NotificationsStateProps<T> {
  isSocketConnected: boolean;
  notificationsToasty: any[];
  tab: string;
}

export interface NotificationsBasePayload<
  T extends NotificationsActions,
  V = null,
> {
  type: T;
  payload: V;
}

export type SetTabPayload = NotificationsBasePayload<
  NotificationsActions.SetTab,
  string
>;

export type SetSocketConnectionPayload = NotificationsBasePayload<
  NotificationsActions.SetSocketConnection,
  boolean
>;

export type AddNotificationPayload<T> = NotificationsBasePayload<
  NotificationsActions.AddNotification,
  any
>;

export type RemoveNotificationPayload = NotificationsBasePayload<
  NotificationsActions.RemoveNotification,
  number | bigint
>;

export type NotificationsPayload<T> =
  | SetTabPayload
  | SetSocketConnectionPayload
  | AddNotificationPayload<T>
  | RemoveNotificationPayload;
