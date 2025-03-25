import { GetServerSidePropsResult } from 'next';
import { PageMetadata } from './pageMetadata.interface';

export type GetServerSidePropsResultWithMetadata =
  GetServerSidePropsResult<PageMetadata>;
