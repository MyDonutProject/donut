import useTranslation from 'next-translate/useTranslation';
import styles from './styles.module.scss';
import { Image } from '@/components/core/Image';

export default function BuyHere() {
  const { t } = useTranslation('common');

  return (
    <div className={styles.container}>
      <h2 className={styles.container__title}>{t('buy_here')}</h2>
      <Image
        src="/donut/assets/m3m3.png"
        alt="buy-here"
        className={styles.container__image}
        fetchPriority="low"
        loading="lazy"
      />
    </div>
  );
}
