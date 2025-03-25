import { CasinoMetadata } from '@/components/core/Seo/props';
import { QueryClient } from '@tanstack/react-query';

export interface WithMetadataClientPageProps {
  metadata: CasinoMetadata;
}

export interface WithQueryAndMetaClientPageProps {
  metadata: CasinoMetadata;
  queryClient: QueryClient;
}
