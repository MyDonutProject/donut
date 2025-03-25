import { Language } from '@/enums/languageId';
import { platformAssets } from '@/utils/assets';
import { JsonLdGenerateType } from './props';

export function generateCasinoLd(
  currenciesAccepted: string[],
  gameUrls: string[],
) {
  const app = platformAssets.app;
  return {
    '@context': 'https://schema.org',
    '@id': `#${app}-org`,
    '@type': 'Casino',
    name: app,
    alternateName: app,
    url: process.env.NEXT_PUBLIC_DEPLOY_URL as string,
    currenciesAccepted,
    paymentAccepted: [''],
    memberOf: ['https://cryptogambling.org/'],
    mainEntityOfPage: process.env.NEXT_PUBLIC_DEPLOY_URL as string,
    logo: platformAssets.logo.web.dark,
    description: `${app} is the leading online casino and sports betting platform.`,
    foundingDate: '2024',
    sameAs: [...gameUrls, process.env.NEXT_PUBLIC_DEPLOY_URL as string],
  };
}

export function generateWebsiteLd() {
  const app = platformAssets.app;
  const languages = Object.values(Language);

  return {
    '@context': 'https://schema.org',
    '@id': `#${app}-website`,
    '@type': 'Website',
    name: app,
    author: {
      '@id': `#${app}-org`,
    },
    sourceOrganization: {
      '@id': `#${app}-org`,
    },
    translator: {
      '@id': `#${app}-org`,
    },
    logo: platformAssets.logo.web.dark,
    description: `${app} is the leading online casino and sports betting platform.`,
    url: process.env.NEXT_PUBLIC_DEPLOY_URL as string,
    inLanguage: languages,
  };
}

export async function generateJsonLd(type: JsonLdGenerateType) {
  // const gameUrls = await generateSameAsUrls();

  switch (type) {
    case 'casino':
      return generateCasinoLd([], []);
    case 'website':
      return generateWebsiteLd();
  }
}
