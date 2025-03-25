import { useCallback } from 'react';
import { setCookie } from 'cookies-next';
import i18nSetLanguage from 'next-translate/setLanguage';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { CookiesKey } from '@/enums/cookiesKey';

export function useSetLanguage() {
  const queryClient: QueryClient = useQueryClient();

  const setLanguage = useCallback(
    async (language: string) => {
      setCookie(CookiesKey.Lang, language, {
        sameSite: 'strict',
        maxAge: 31536000,
      });
      setCookie(CookiesKey.CasinoLang, language, {
        sameSite: 'strict',
        maxAge: 31536000,
      });
      setCookie('NEXT_LOCALE', language);
      await i18nSetLanguage(language);
    },
    [queryClient],
  );

  return setLanguage;
}
