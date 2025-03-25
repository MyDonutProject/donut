import styles from './styles.module.scss';
import MatrixCard from '../Card';
import useTranslation from 'next-translate/useTranslation';

export default function Cards() {
  const { t } = useTranslation('common');

  const slots = [
    {
      title: 'Slot 1',
      address: '12398...alkjshd8',
    },
    {
      title: 'Slot 2',
      address: '12398...alkjshd8',
    },
    {
      title: 'Slot 3',
    },
  ];

  return (
    <div className={styles.container}>
      <MatrixCard title="Matrix 3" slots={slots} status="pending" />
      <MatrixCard title="Matrix 2" slots={slots} status="completed" />
      <MatrixCard title="Matrix 1" slots={slots} status="completed" />
    </div>
  );
}
