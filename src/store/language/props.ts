export type LanguageProps = {
  open: boolean;
};

export enum LanguageActions {
  Toggle = 'language/toggle-modal',
}

export interface LanguageBasePayload<T extends LanguageActions, V = null> {
  type: T;
  payload: V;
}

export type LanguageStatePayload = LanguageBasePayload<LanguageActions.Toggle>;
