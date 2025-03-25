import { useDispatch } from 'react-redux';
import styles from './styles.module.scss';
import NotificationRowContent from './Content';
import { useMemo } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import { useCountUp } from 'use-count-up';
import { removeNotificationToasty } from '@/store/notifications/actions';
import { NotificationRowProps, NotificationRowType } from './props';

export default function NotificationRow({
  notification,
  type,
}: NotificationRowProps) {
  const dispatch = useDispatch();
  const startTime = useMemo(
    //@ts-ignore
    () => notification && new Date(notification?.createdAt).getTime(),
    [notification],
  );
  const endTime = useMemo(
    //@ts-ignore
    () => notification && new Date(notification?.createdAt).getTime() - 10000,
    [notification],
  );
  function handleRemoveNotification(): void {
    dispatch(removeNotificationToasty(notification?.id as bigint));
  }
  const { value } = useCountUp({
    start: startTime,
    end: endTime,
    duration: 10,
    updateInterval: 1,
    easing: 'linear',
    isCounting: type === NotificationRowType.Row,
    onComplete: handleRemoveNotification,
  });

  return (
    <div
      className={`${styles.container} ${type === NotificationRowType.Row ? styles['container--row'] : ''}`}
    >
      <NotificationRowContent notification={notification} type={type} />
      {type === NotificationRowType.Toasty && (
        <>
          <div className={styles.spacer} />
          <div className={styles['close-icon-container']}>
            <div className={styles['circular-progress-bar-container']}>
              <CircularProgressbar
                value={value as number}
                styles={buildStyles({ pathTransition: '1.7s' })}
                strokeWidth={8}
                minValue={endTime}
                maxValue={startTime}
              />
            </div>
            <i
              className={`${styles['close-icon']} fa-duotone fa-xmark`}
              onClick={handleRemoveNotification}
            />
          </div>
        </>
      )}
    </div>
  );
}
