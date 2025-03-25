import { GetStaticPropsResult } from 'next';
import { PageMetadata } from './pageMetadata.interface';
import { DehydratedState } from '@tanstack/react-query';

export type GetStaticPropsResultWithMetadataAndServerState<T = {}> =
  GetStaticPropsResult<
    ((PageMetadata & { dehydratedState: DehydratedState }) & T) | null
  >;
