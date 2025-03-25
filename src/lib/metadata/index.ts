import { Metadata } from 'next';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import { Twitter } from 'next/dist/lib/metadata/types/twitter-types';
import { GenerateMetadataProps } from './props';
import getTranslation from 'next-translate/getT';
import { getCanonicalAlternates } from './helper';
import { platformAssets } from '@/utils/assets';
import { Language } from '@/enums/languageId';

const baseUrl = String(process.env.NEXT_PUBLIC_DEPLOY_URL) as any;

function getDefaultSeo({
  description,
  title,
  lang,
  image,
}: Partial<GenerateMetadataProps>): OpenGraph | Twitter {
  return {
    title,
    description,
    type: 'website',
    url: baseUrl,
    siteName: platformAssets.app,
    locale: lang,
    images:
      image ??
      `${process.env.NEXT_PUBLIC_S3_BUCKET_BASE_URL}/artworks/banners/thumb/banner-seo.jpeg`,
  };
}

function generateTitle(namespace?: string, title?: string) {
  if (!title) {
    return '';
  }

  if (namespace) {
    return `${namespace}:${title}`;
  }

  return `seo:${title}`;
}

function generateDescription(description?: string) {
  if (!description) {
    return 'seo:description';
  }

  return description;
}

export async function generateMetadata({
  follow = true,
  isPrivate: privateMetadata,
  image,
  i18nNamespace,
  ...params
}: GenerateMetadataProps): Promise<Metadata> {
  const isPrivate = privateMetadata;
  const { lang } = params ?? {};
  const t = await getTranslation(params?.lang, ['seo', 'common']);
  const subtitle = t(
    generateTitle(i18nNamespace, params?.title),
    {
      app_provider: platformAssets.app,
    },
    {
      fallback: params?.title,
    },
  );
  const title = `${platformAssets.app} | ${subtitle}`;

  const description = t(generateDescription(params?.description), {
    app_provider: platformAssets.app,
  });

  const baseSeo = getDefaultSeo({
    lang,
    description,
    title,
    image,
  });

  if (isPrivate) {
    return {
      title,
      robots: {
        follow: false,
        index: false,
        nocache: true,
        googleBot: {
          follow: false,
          index: false,
          nocache: false,
        },
      },
    };
  }
  return {
    title,
    description,
    referrer: 'origin-when-cross-origin',
    metadataBase: baseUrl,
    alternates: {
      canonical: params?.path
        ? `${lang == Language.English ? '' : lang}${params?.path}`
        : `${lang}`,
      languages: getCanonicalAlternates(params?.path),
    },
    robots: {
      follow,
      index: follow,
      nocache: !follow,
      googleBot: {
        follow: follow,
        index: follow,
        nocache: !follow,
      },
    },
    openGraph: baseSeo,
    twitter: baseSeo,
    icons: {
      icon: '/favicon.png',
    },
  };
}
