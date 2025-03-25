import { CasinoMetadata } from '@/components/core/Seo/props';
import { EmotionCache } from '@emotion/cache';
import { Setting } from '@/models/setting';
import { QueryClient } from '@tanstack/react-query';
import { AppPropsType } from 'next/dist/shared/lib/utils';

export interface CustomAppProps extends AppPropsType {
  emotionCache: EmotionCache;
  queryClient: QueryClient;
  pageProps: {
    dehydratedState?: object;
    metadata?: CasinoMetadata;
    settings: Setting;
  };
}

export interface CustomPageProps {}
