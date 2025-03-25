import useTranslation from 'next-translate/useTranslation';
import styles from './styles.module.scss';
import TransText from 'next-translate/Trans';

export default function HomeSection() {
  const { t } = useTranslation('common');

  return (
    <div className={styles.container}>
      <div className={styles.container__description}>
        {t('section_donut_description')}
      </div>
      <div className={styles.container__description}>
        {t('section_donut_description_highlight')}
      </div>
      <div className={styles.container__highlight}>
        <TransText i18nKey="common:table_heading" components={{
          strong: <strong />
        }} />
      </div>
    </div>
  );
}
