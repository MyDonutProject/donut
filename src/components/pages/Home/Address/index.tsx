import useTranslation from 'next-translate/useTranslation';
import styles from './styles.module.scss';
import { Button } from '@/components/core/Button';
import { Tooltip } from '@mui/material';
import { useNotificationService } from '@/hooks/notifications/useNotificationService';
import { Input } from '@/components/core/Input';

export default function HomeContractAddress() {
  const { t } = useTranslation('common');
  const { NotificationsService } = useNotificationService();

  function handleCopyAddress() {
    NotificationsService.success({
      title: t('copy_base_title'),
      message: t('copy_url'),
    });
    navigator.clipboard.writeText('OxB3B32F9f8827D4634fE7d973Fa1034Ec9fdDBЗB3');
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.container__title}>{t('contract_address')}</h2>
      <Input
        value="OxB3B32F9f8827D4634fE7d973Fa1034Ec9fdDBЗB3"
        readOnly
        className={styles.container__input}
        customIcon={
          <Tooltip title={t('copy_address')}>
            <Button
              useMaxContent
              className={styles.container__input__icon}
              onClick={handleCopyAddress}
            >
              <i className="fa-solid fa-copy" />
            </Button>
          </Tooltip>
        }
        hasPaddingRight
        hideLock
      />
    </div>
  );
}
