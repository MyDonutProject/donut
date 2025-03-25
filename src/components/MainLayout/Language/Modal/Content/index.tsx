import styles from './styles.module.scss';
import LanguageList from './Languages';

export default function LanguageModalContent() {
  return (
    <div className={styles.container}>
      <LanguageList />
    </div>
  );
}
