import { memo } from 'react';
import styles from './styles.module.scss';
import { LanguageListProps } from '@/types/translate/props';
import useTranslation from 'next-translate/useTranslation';
import { Input } from '@/components/core/Input';
import { useSetLanguage } from '@/hooks/useSetLanguage';
import { useModal } from '@/hooks/modal/useModal';
import { ModalsKey } from '@/enums/modalsKey';

function Language({ lang, image, name }: LanguageListProps) {
  const { t, lang: currentLang } = useTranslation('common');
  const isSelected: boolean = currentLang?.slice(0, 2) === lang;
  const setLanguage = useSetLanguage();
  const { onClose } = useModal(ModalsKey.Language);

  async function onClick() {
    try {
      await setLanguage(lang);
    } finally {
      onClose();
    }
  }

  return (
    <div
      className={`${styles.container} ${isSelected ? styles['container--selected'] : ''}`}
      onClick={onClick}
    >
      <div className={styles.container__row}>
        <img
          src={`${process.env.NEXT_PUBLIC_S3_BUCKET_BASE_URL}/flags/${image}`}
          alt={`flag-icon-${name}`}
          className={styles.container__image}
        />
        {t(lang) as string}
      </div>

      <Input type="radio" checked={isSelected} />
    </div>
  );
}

export default memo(Language);
