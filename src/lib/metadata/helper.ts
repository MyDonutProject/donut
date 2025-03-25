import { Language } from '@/enums/languageId';

export function getCanonicalAlternates(path?: string) {
  const relativePath = path ?? '/';
  const languages = Object.keys(Language).reduce(
    (acc, key) => {
      const languageCode = Language[key as keyof typeof Language];
      const languagePath = `${languageCode === 'en' ? '' : `/${languageCode}`}${relativePath}`;

      acc[languageCode] = languagePath;

      return acc;
    },
    {} as { [key: string]: string },
  );

  return languages;
}
