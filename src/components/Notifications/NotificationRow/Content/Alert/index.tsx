  
import BaseContent from '../BaseContent';
import { NotificationRowProps } from '../../props';
import useTranslation from 'next-translate/useTranslation';
import { AlertExtraParams } from '@/models/alert';
import { AlertType } from '@/models/alert/alert-type.enum';
import useTimeAgo from '@/hooks/useTimeAgo';

export default function AlertContent({
  notification,
  type,
}: NotificationRowProps) {
  const { t } = useTranslation('common');
  const extra: AlertExtraParams = (notification as any).extra;
  const formattedDate = useTimeAgo  ({
    date: new Date((notification as any)?.createdAt ?? ''),
  });

  function getAlertIcon(type: AlertType) {
    switch (type) {
      case AlertType.Info:
        return 'fa-solid fa-info-square';
      case AlertType.Success:
        return 'fa-solid fa-check-circle';
      case AlertType.Error:
        return 'fa-solid fa-exclamation-triangle';
    }
  }

  return (
    <BaseContent
      icon={getAlertIcon(extra?.type as AlertType)}
      title={t(extra?.title as string)}
      description={t(extra?.message as string, extra?.params ?? {}) as string}
      type={type}
      createdAt={formattedDate}
      //@ts-ignore
      notificationTypeId={notification?.type?.id}
      extra={(notification as any)?.extra}
    />
  );
}
