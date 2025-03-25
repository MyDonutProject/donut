import nextTranslate from 'next-translate-plugin';
import withImage from 'next-images';

/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/sports',
        destination: '/sports/[...slug]',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*\\.(woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        source: '/:path*\\.(jpg|jpeg|png|gif|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800',
          },
        ],
      },
      {
        source: '/:path*\\.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10800',
          },
        ],
      },
    ];
  },
  productionBrowserSourceMaps: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: true,
    nextScriptWorkers: true,
    webpackBuildWorker: true,
  },
  sassOptions: {
    includePaths: ['./src/components', './src/pages'],
    prependData: `@import "@/styles/theme/main.scss";`,
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['zh', 'ru', 'pt', 'fr', 'es', 'en', 'de', 'id', 'hi'],
    localeDetection: false,
  },
  compiler: {
    styledComponents: true,
  },
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  transpilePackages: ['@donut/common'],
  publicRuntimeConfig: {
    BASE_API: process.env.NEXT_PUBLIC_BASE_API,
    PROVIDER: process.env.NEXT_PUBLIC_BET_NAME,
    CF_DISTRIBUTION: process.env.NEXT_PUBLIC_CF_DISTRIBUTION,
    DEPLOY_URL: process.env.NEXT_PUBLIC_DEPLOY_URL,
    JWT_EXPIRE_SECONDS: process.env.NEXT_PUBLIC_JWT_EXPIRE_SECONDS,
    S3_BUCKET_BASE_URL: process.env.NEXT_PUBLIC_S3_BUCKET_BASE_URL,
    LOTTIE_URL: process.env.NEXT_PUBLIC_LOTTIE_URL,
  },
};

const config = withImage(nextTranslate(nextConfig));

export default config;
