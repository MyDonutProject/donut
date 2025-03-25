import { ThemeType } from '@/enums/theme';
import {
  ThemeStateProps,
  ThemeActions,
  SetThemePayload,
  ThemeStatePayload,
} from './props';

let initialState: ThemeStateProps = {
  type: ThemeType.light,
  setting: null,
};

export default function reducer(
  state: ThemeStateProps = initialState,
  action: ThemeStatePayload,
): ThemeStateProps {
  switch (action.type) {
    case ThemeActions.Set: {
      const type: ThemeType = (action as SetThemePayload).payload;

      return { ...state, ...{ type: type } };
    }
    case ThemeActions.Settings:
      initialState = {
        ...state,
        setting: action.payload,
      };
      return {
        ...state,
        setting: action.payload,
      };
    default:
      return state;
  }
}
