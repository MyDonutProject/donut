import {
  createTheme,
  experimental_extendTheme,
  ThemeOptions,
} from '@mui/material';
import { ThemeType } from '@/enums/theme';
import { platformAssets } from '@/utils/assets';

export const baseTheme: ThemeOptions = {
  direction: 'ltr',
};

export const themeConfig = experimental_extendTheme({
  colorSchemes: {
    [ThemeType.light]: createTheme(baseTheme, platformAssets.theme.light),
    [ThemeType.dark]: createTheme(baseTheme, platformAssets.theme.dark),
  },
});
