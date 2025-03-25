import useTranslation from 'next-translate/useTranslation';
import styles from './styles.module.scss';
import LanguageModalContent from './Content';
import { ModalLayout } from '@/components/core/Modal/Layout';
import { ModalsKey } from '@/enums/modalsKey';

export default function LanguageModal() {
  const { t } = useTranslation('common');

  return (
    <ModalLayout
      modal={ModalsKey.Language}
      title={t('tab_language')}
      smallMobilePadding
      fitContent
      className={styles.container}
    >
      <LanguageModalContent />
    </ModalLayout>
  );
}
