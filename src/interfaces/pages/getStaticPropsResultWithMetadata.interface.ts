import { GetStaticPropsResult } from 'next';
import { PageMetadata } from './pageMetadata.interface';

export type GetStaticPropsResultWithMetadata =
  GetStaticPropsResult<PageMetadata | null>;
