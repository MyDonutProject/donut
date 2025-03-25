import { JSX, useMemo } from 'react';
import styles from './styles.module.scss';
import Language from './Language';
import { languageList } from '@/constants/translateCountries';

export default function LanguageList() {
  const Languages: JSX.Element[] = useMemo(
    () =>
      languageList.map(language => (
        <Language key={`language_${language.id}`} {...language} />
      )),
    [],
  );

  return <div className={styles.container}>{Languages}</div>;
}
