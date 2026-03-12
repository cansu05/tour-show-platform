'use client';

import type {ReactNode} from 'react';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {appTheme} from '@/theme/theme';

type Props = {
  children: ReactNode;
};

export function AppProviders({children}: Props) {
  return (
    <AppRouterCacheProvider options={{key: 'mui'}}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

