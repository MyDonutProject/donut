import { LanguageActions, LanguageBasePayload } from './props';

export function toggleModalLanguage(): LanguageBasePayload<LanguageActions.Toggle> {
  return {
    type: LanguageActions.Toggle,
    payload: null,
  };
}
