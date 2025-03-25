import AlertContent from './Alert';
import { NotificationRowProps } from '../props';

export default function NotificationRowContent({
  notification,
  type,
}: NotificationRowProps) {
  //@ts-ignore
  switch ((notification as any)?.type?.id?.toString?.()) {
    default:
      return <AlertContent notification={notification} type={type} />;
  }
}
