import { ThemeType } from '@/enums/theme';
import { ThemeActions, SetThemePayload, SetSettingsPayload } from './props';
import { Setting } from '@/models/setting';

export function setTheme(theme: ThemeType): SetThemePayload {
  return { type: ThemeActions.Set, payload: theme };
}

export function setSettings(payload: Setting): SetSettingsPayload {
  return {
    type: ThemeActions.Settings,
    payload,
  };
}
