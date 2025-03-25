export interface CasinoMetadata {
  title?: string;
  description?: string;
  referrer?: string;
  metadataBase?: string;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
  robots?: {
    follow?: boolean;
    index?: boolean;
    nocache?: boolean;
    googleBot?: {
      follow?: boolean;
      index?: boolean;
      nocache?: boolean;
    };
  };
  openGraph?: {
    title?: string;
    description?: string;
    type?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    images?: string;
  };
  twitter?: {
    title?: string;
    description?: string;
    type?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    images?: string;
  };
  icons?: {
    icon?: string;
  };
  keywords?: string[];
}

export interface SeoProps {
  metadata: CasinoMetadata;
}
