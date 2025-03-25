import { useMemo } from 'react';
import { NotificationsService as DonutNotificationsService } from '@/services/NotificationService';
import { getStore } from '@/store';

export function useNotificationService() {
  const NotificationsService = useMemo(
    () => new DonutNotificationsService(getStore()),
    [],
  );

  return {
    NotificationsService,
  };
}
