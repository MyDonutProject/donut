import { Language } from '@/enums/languageId';

export interface GenerateMetadataProps {
  lang: Language;
  title?: string;
  description?: string;
  path: string;
  follow?: boolean;
  isPrivate?: boolean;
  image?: string;
  i18nNamespace?: string;
}
