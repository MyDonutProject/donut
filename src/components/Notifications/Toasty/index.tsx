import { RootState } from '@/store';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import NotificationRow from '../NotificationRow';
import { useMemo } from 'react';
import { NotificationRowType } from '../NotificationRow/props';

export default function NotificationToasty() {
  const notifications = useSelector(
    (state: RootState) => state.notifications.notificationsToasty,
  );

  const Notifications = useMemo(
    () =>
      notifications?.map(notification => (
        <div
          className={styles.slide}
          key={`notification-row-${notification?.id}`}
        >
          <NotificationRow
            notification={notification}
            type={NotificationRowType.Toasty}
          />
        </div>
      )),
    [notifications],
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>{Notifications}</div>
    </div>
  );
}
