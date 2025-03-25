/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLATFORM_NAME: string;
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly BASE_URL: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly MODE: string;
  readonly VITE_BASE_API: string;
  readonly VITE_JWT_EXPIRE_SECONDS: string;
  readonly VITE_S3_BUCKET_BASE_URL: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_PARTNER_URL: string;
  readonly VITE_CF_DISTRIBUTION: string;
  readonly VITE_BASE_DEPLOY_URL: string;
  readonly VITE_BASE_LOTTIE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
