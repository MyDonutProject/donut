import { enUS as enLocale } from '@mui/x-date-pickers/locales';
import { ptBR as ptLocale } from '@mui/x-date-pickers/locales';
import { frFR as frLocale } from '@mui/x-date-pickers/locales';
import { deDE as deLocale } from '@mui/x-date-pickers/locales';
import { esES as esLocale } from '@mui/x-date-pickers/locales';
import { ruRU as ruLocale } from '@mui/x-date-pickers/locales';
import { zhCN as zhLocale } from '@mui/x-date-pickers/locales';
import { itIT as itLocale } from '@mui/x-date-pickers/locales';

export default function getDatePickerTranslation(lang: string) {
  switch (lang.slice(0, 2)) {
    case 'pt':
      return ptLocale;
    case 'en':
      return enLocale;
    case 'fr':
      return frLocale;
    case 'es':
      return esLocale;
    case 'de':
      return deLocale;
    case 'ru':
      return ruLocale;
    case 'zh':
      return zhLocale;
    case 'it':
      return itLocale;
    default:
      return enLocale;
  }
}
