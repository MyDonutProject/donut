
import {
  NotificationsActions,
  NotificationsPayload,
  NotificationsStateProps,
} from './props';

const initialState: NotificationsStateProps<any> = {
  tab: 'inbox',
  isSocketConnected: false,
  notificationsToasty: [],
};

export function notificationsReducer<T>(
  state: NotificationsStateProps<T> = initialState,
  action: NotificationsPayload<T>,
): NotificationsStateProps<T> {
  switch (action.type) {
    case NotificationsActions.AddNotification:
      
      return {
        ...state,
        notificationsToasty: state.notificationsToasty.concat(action.payload),
      };
    case NotificationsActions.RemoveNotification:
      return {
        ...state,
        notificationsToasty: state.notificationsToasty.filter(
          notification => notification.id !== action.payload,
        ),
      };

    case NotificationsActions.SetTab:
      return {
        ...state,
        tab: action.payload,
      };
    case NotificationsActions.SetSocketConnection:
      return {
        ...state,
        isSocketConnected: action.payload,
      };
    default:
      return state;
  }
}
