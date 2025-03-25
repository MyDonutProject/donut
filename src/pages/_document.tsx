/* eslint-disable react/no-danger */
import * as React from 'react';

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Script from 'next/script';

import { AppPropsType } from 'next/dist/shared/lib/utils';

import { CasinoMetadata } from '@/components/core/Seo/props';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { Setting } from '@/models/setting';
import { platformAssets } from '@/utils/assets';
import { theme } from '@/utils/theme';
import { generateServerVariables } from '@/utils/theme/colors';

export default class MyDocument extends Document<{
  structuredData: { casinoLd: object; websiteLd: object };
  settings: Setting;
  metadata: CasinoMetadata;
}> {
  render() {
    const { locale } = this.props;

    return (
      <Html lang={locale} translate="no" className="notranslate">
        <Head>
          <meta name="emotion-insertion-point" content="" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
          />
          <meta name="google" content="notranslate" />
          <meta
            name="theme-color"
            content={platformAssets?.theme?.dark?.palette?.background.default}
          />
          <link
            rel="stylesheet"
            href={`/font-awesome/all.css`}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link rel="icon" href="/donut/assets/donut.png" />
          {(theme?.fontFamily?.url && (
            <link
              id="font-family-url"
              href={theme?.fontFamily?.url}
              rel="stylesheet"
            />
          )) || (
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
              rel="stylesheet"
            />
          )}
          <Script
            id="site-seal-js"
            strategy="afterInteractive"
            type="text/javascript"
            src={process.env.NEXT_PUBLIC_SITE_SEAL}
          />
          <Script
            id="redux-setting-state"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.initialState=${JSON.stringify(theme ?? {})}`,
            }}
          />
          <style global id="setting-style">
            {`
            :root {
              ${generateServerVariables(theme as any)}
            }
          `}
          </style>
          {(this.props as any).styles}
        </Head>

        <body suppressHydrationWarning>
          <InitColorSchemeScript defaultMode="dark" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const sheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => (props: AppPropsType) =>
          sheet.collectStyles(
            <App
              {...props}
              pageProps={{
                ...props.pageProps,
                settings: theme as any,
              }}
            />,
          ),
        enhanceComponent: Component => Component,
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles} {sheet.getStyleElement()}
        </>
      ),
    };
  } finally {
    sheet.seal();
  }
};
