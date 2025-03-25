import AffiliatesTableHeaderSelect from './Select';
import styles from './styles.module.scss';
import useTranslation from 'next-translate/useTranslation';
export default function AffiliatesTableHeader() {
  const { t } = useTranslation('common');

  return (
    <div className={styles.container}>
      <div className={styles.container__row}>
        <div className={styles.container__row__title}>{t('my_referrals')}</div>
        <AffiliatesTableHeaderSelect />
      </div>
    </div>
  );
}
