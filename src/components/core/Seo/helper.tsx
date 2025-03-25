import React from 'react';
import { CasinoMetadata } from './props';

export function generateSocialMetaTags(metadata: CasinoMetadata) {
  const tags: any = [];

  if (metadata.openGraph) {
    const { openGraph } = metadata;
    tags.push(
      <React.Fragment key="openGraph">
        {openGraph.title && (
          <meta
            property="og:title"
            key={`og-title-${openGraph.title}`}
            content={openGraph.title}
          />
        )}
        {openGraph.description && (
          <meta
            property="og:description"
            key={`og-description-${openGraph.description}`}
            content={openGraph.description}
          />
        )}
        {openGraph.type && (
          <meta
            property="og:type"
            key={`og-type-${openGraph.type}`}
            content={openGraph.type}
          />
        )}
        {openGraph.url && (
          <meta
            property="og:url"
            key={`og-url-${openGraph.url}`}
            content={openGraph.url}
          />
        )}
        {openGraph.siteName && (
          <meta
            property="og:site_name"
            key={`og-site-name-${openGraph.siteName}`}
            content={openGraph.siteName}
          />
        )}
        {openGraph.locale && (
          <meta
            property="og:locale"
            key={`og-locale-${openGraph.locale}`}
            content={openGraph.locale}
          />
        )}
        {openGraph.images && (
          <meta
            property="og:image"
            key={`og-image-${openGraph.images}`}
            content={openGraph.images}
          />
        )}
      </React.Fragment>,
    );
  }

  if (metadata.twitter) {
    const { twitter } = metadata;
    tags.push(
      <React.Fragment key="twitter">
        {twitter.title && (
          <meta
            name="twitter:title"
            key={`twitter-title-${twitter.title}`}
            content={twitter.title}
          />
        )}
        {twitter.description && (
          <meta
            name="twitter:description"
            key={`twitter-description-${twitter.description}`}
            content={twitter.description}
          />
        )}
        {twitter.type && (
          <meta
            name="twitter:card"
            key={`twitter-card-${twitter.type}`}
            content={twitter.type}
          />
        )}
        {twitter.url && (
          <meta
            name="twitter:url"
            key={`twitter-url-${twitter.url}`}
            content={twitter.url}
          />
        )}
        {twitter.siteName && (
          <meta
            name="twitter:site"
            key={`twitter-site-name-${twitter.siteName}`}
            content={twitter.siteName}
          />
        )}
        {twitter.locale && (
          <meta
            name="twitter:locale"
            key={`twitter-locale-${twitter.locale}`}
            content={twitter.locale}
          />
        )}
        {twitter.images && (
          <meta
            name="twitter:image"
            key={`twitter-image-${twitter.images}`}
            content={twitter.images}
          />
        )}
      </React.Fragment>,
    );
  }

  return tags;
}
