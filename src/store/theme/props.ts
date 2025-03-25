import { ThemeType } from '@/enums/theme';
import { Setting } from '@/models/setting';

export type ThemeStateProps = {
  type: ThemeType;
  setting?: Setting;
};

export enum ThemeActions {
  Set = 'theme/set',
  Settings = 'theme/settings-initialization',
}

export interface ThemeBasePayload<T extends ThemeActions, V = null> {
  type: T;
  payload: V;
}
export type SetThemePayload = ThemeBasePayload<ThemeActions.Set, ThemeType>;

export type SetSettingsPayload = ThemeBasePayload<
  ThemeActions.Settings,
  Setting
>;

export type ThemeStatePayload = SetThemePayload | SetSettingsPayload;
