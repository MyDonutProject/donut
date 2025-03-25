import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider as CssVarsProvider } from '@mui/material';
import { ThemeType } from '@/enums/theme';
import { RootState } from '@/store';
import { themeConfig } from '@/styles/theme/theme';

export default function ThemeProvider({ children }: PropsWithChildren) {
  const theme: ThemeType = useSelector((state: RootState) => state.theme.type);

  return (
    <CssVarsProvider theme={themeConfig?.colorSchemes?.[theme]}>
      <StyledThemeProvider theme={themeConfig?.colorSchemes?.[theme] as any}>
        {children}
      </StyledThemeProvider>
    </CssVarsProvider>
  );
}
