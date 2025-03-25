/* eslint-disable react/no-danger */
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { HydrationBoundary } from '@tanstack/react-query';
import Head from 'next/head';
import '@/types/bigint-serialization';
import { useDeferredStyles } from '@/hooks/seo/useDeferredStyles';
import { wrapper } from '@/store';
import dynamic from 'next/dynamic';
import { setSettings } from '@/store/theme/actions';
import FramerProvider from '@/providers/FramerProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import MainLayout from '@/components/MainLayout';
import Seo from '@/components/core/Seo';
import { CasinoMetadata } from '@/components/core/Seo/props';

import '../components/Notifications/NotificationRow/circular-progress.scss';
import '@/styles/theme/globals.scss';

const NotificationToasty = dynamic(
  () => import('@/components/Notifications/Toasty'),
  { ssr: true },
);

// App.tsx
import { createAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import QueryClientProvider from '@/providers/queryClientProvider';
import { getComputedColor } from '@/utils/theme/colors';

// 0. Set up Solana Adapter
const solanaAdapter = new SolanaAdapter({
  //@ts-ignore
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

// 2. Create a metadata object - optional

const metadata = {
  name: 'Donut',
  description: 'Donut',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  url: process.env.NEXT_PUBLIC_APP_URL,
};

// 3. Create modal
createAppKit({
  adapters: [solanaAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata,
  projectId,
  debug: process.env.NODE_ENV === 'development',
  features: {
    analytics: true,
    email: false,
    socials: false,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': getComputedColor('--primary-color'),
    '--w3m-z-index': 99999999999999,
    '--w3m-border-radius-master': getComputedColor('--shape-borderRadius'),
    '--w3m-color-mix': getComputedColor('--primary-color'),
    '--w3m-color-mix-strength': 0.5,
    '--w3m-font-family': getComputedColor('--font-family'),
    '--w3m-qr-color': getComputedColor('--primary-color'),
  },
});

function MainApp({ Component, ...rest }: any) {
  const { store, props } = wrapper.useWrappedStore(rest);
  useDeferredStyles(props?.pageProps?.settings?.fontFamily?.url);

  if (props?.pageProps?.settings) {
    store.dispatch(setSettings(props?.pageProps?.settings));
  }
  const dehydratedState = props?.pageProps?.dehydratedState;

  return (
    <main>
      <Head>
        <Head>
          <noscript>
            <link rel="icon" href="/favicon.png" />
            <link
              href={
                props?.pageProps?.settings?.fontFamily?.url ||
                'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
              }
              rel="stylesheet"
            />
            <link
              rel="stylesheet"
              href={`${process.env.NEXT_PUBLIC_CF_DISTRIBUTION}/fonts/FontAwesome/all.css`}
            />
            <link
              rel="stylesheet"
              href={`${process.env.NEXT_PUBLIC_CF_DISTRIBUTION}/fonts/casino-icons.css`}
            />
          </noscript>
        </Head>
      </Head>
      <FramerProvider>
        <QueryClientProvider>
          <HydrationBoundary state={dehydratedState}>
              <ThemeProvider>
                <CssBaseline />
                {!!props?.pageProps?.metadata && (
                  <Seo
                    metadata={props?.pageProps?.metadata as CasinoMetadata}
                  />
                )}
                <NotificationToasty />
                <MainLayout>
                  <Component {...props?.pageProps} suppressHydrationWarning />
                </MainLayout>
              </ThemeProvider>
          </HydrationBoundary>
        </QueryClientProvider>
      </FramerProvider>
    </main>
  );
}

export default wrapper.withRedux(MainApp);
