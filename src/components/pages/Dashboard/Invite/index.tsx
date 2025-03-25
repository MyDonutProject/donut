import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import styles from './styles.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useNotificationService } from '@/hooks/notifications/useNotificationService';

export default function DashboardInvite() {
  const { t } = useTranslation('common');
  const { NotificationsService } = useNotificationService();

  function handleCopy() {
    navigator.clipboard.writeText('donut.io/0x1234..5678');
    NotificationsService.success({
      title: t('copy_base_title'),
      message: t('copy_url'),
    });
  }

  return (
    <div className={styles.card}>
      <div className={styles.card__content}>
        <h2 className={styles.card__content__title}>{t('invite_title')}</h2>
        <div className={styles.card__content__input}>
          <Input
            value="donut.io/0x1234..5678"
            readOnly
            hideLock
            className={styles.card__content__input}
            customIcon={
              <Button
                className={styles.card__button}
                useMaxContent
                onClick={handleCopy}
              >
                {t('copy')}
              </Button>
            }
          />
        </div>
      </div>
      <img
        className={styles.card__image}
        src="/donut/assets/refer.png"
        alt="Invite"
      />
    </div>
  );
}
