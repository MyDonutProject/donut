/* eslint-disable react/no-danger */
import MainLayout from "@/components/MainLayout";
import Seo from "@/components/core/Seo";
import { CasinoMetadata } from "@/components/core/Seo/props";
import { useDeferredStyles } from "@/hooks/seo/useDeferredStyles";
import FramerProvider from "@/providers/FramerProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import { wrapper } from "@/store";
import { setSettings } from "@/store/theme/actions";
import "@/types/bigint-serialization";
import CssBaseline from "@mui/material/CssBaseline";
import { HydrationBoundary } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Head from "next/head";

import "@/styles/theme/globals.scss";
import "../components/Notifications/NotificationRow/circular-progress.scss";

const NotificationToasty = dynamic(
  () => import("@/components/Notifications/Toasty"),
  { ssr: true }
);

// App.tsx
import SponsorModal from "@/components/core/SponsorModal";
import { ModalsKey } from "@/enums/modalsKey";
import { ClusterProvider } from "@/providers/Cluster";
import { SolanaProvider } from "@/providers/Solana";
import QueryClientProvider from "@/providers/queryClientProvider";
import { hasCookie, setCookie } from "cookies-next/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

function MainApp({ Component, ...rest }: any) {
  const { query, push } = useRouter();
  const { store, props } = wrapper.useWrappedStore(rest);
  useDeferredStyles(props?.pageProps?.settings?.fontFamily?.url);

  if (props?.pageProps?.settings) {
    store.dispatch(setSettings(props?.pageProps?.settings));
  }
  const dehydratedState = props?.pageProps?.dehydratedState;

  function handleSetSponsor() {
    if (typeof window === "undefined") return;

    if (!hasCookie("sponsor")) {
      push({
        hash: ModalsKey.Sponsor,
      });
      return;
    }

    if (query?.sponsor) {
      setCookie("sponsor", query?.sponsor, {
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  useEffect(handleSetSponsor, []);

  return (
    <main>
      <Head>
        <Head>
          <noscript>
            <link rel="icon" href="/favicon.png" />
            <link
              href={
                props?.pageProps?.settings?.fontFamily?.url ||
                "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
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
                <Seo metadata={props?.pageProps?.metadata as CasinoMetadata} />
              )}
              <NotificationToasty />
              <ClusterProvider>
                <SolanaProvider>
                  <SponsorModal />
                  <MainLayout>
                    <Component {...props?.pageProps} suppressHydrationWarning />
                  </MainLayout>
                </SolanaProvider>
              </ClusterProvider>
            </ThemeProvider>
          </HydrationBoundary>
        </QueryClientProvider>
      </FramerProvider>
    </main>
  );
}

export default wrapper.withRedux(MainApp);
