import Head from 'next/head';
import { Robots } from 'next/dist/lib/metadata/types/metadata-types';
import { SeoProps } from './props';
import { generateSocialMetaTags } from './helper';

export default function Seo({ metadata: unparsedMetadata }: SeoProps) {
  const metadata = JSON.parse(unparsedMetadata as string);
  return (
    <Head>
      {' '}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
      />
      {metadata.title && (
        <title key={`title-${metadata.title}`}>
          {metadata.title as string}
        </title>
      )}
      {metadata.description && (
        <meta
          name="description"
          key={`meta-description-${metadata.description}`}
          content={metadata.description}
        />
      )}
      {metadata.referrer && (
        <meta
          name="referrer"
          key={`referrer-${metadata.referrer}`}
          content={metadata.referrer}
        />
      )}
      {metadata.alternates?.canonical && (
        <link
          rel="canonical"
          key={`canonical-${metadata.alternates.canonical}`}
          href={
            String(metadata.metadataBase) +
            String(metadata.alternates.canonical)
          }
        />
      )}
      {metadata.alternates?.languages &&
        Object.entries(metadata.alternates.languages).map(([lang, url]) => (
          <link
            key={`alternate-lang-${lang}`}
            rel="alternate"
            hrefLang={lang}
            href={String(metadata.metadataBase) + url}
          />
        ))}
      {metadata.robots && (
        <meta
          name="robots"
          key="robots"
          content={`${(metadata.robots as Robots).index ? 'index' : 'noindex'}, ${(metadata.robots as Robots).follow ? 'follow' : 'nofollow'}${(metadata.robots as Robots).nocache ? ', noarchive' : ''}`}
        />
      )}
      {metadata.robots?.googleBot && (
        <meta
          name="googlebot"
          key="googlebot"
          content={`${metadata.robots?.googleBot?.index ? 'index' : 'noindex'}, ${metadata?.robots?.googleBot?.follow ? 'follow' : 'nofollow'}${metadata?.robots?.googleBot?.nocache ? ', noarchive' : ''}`}
        />
      )}
      {(metadata.openGraph || metadata.twitter) &&
        generateSocialMetaTags(metadata)}
      {metadata.icons?.icon && (
        <link
          rel="icon"
          key={`icon-${metadata.icons.icon}`}
          href={metadata.icons.icon}
        />
      )}
      {metadata.keywords && (
        <meta
          name="keywords"
          key={`keywords-${metadata.keywords.join(',')}`}
          content={(metadata.keywords as string[]).join(', ')}
        />
      )}
    </Head>
  );
}
