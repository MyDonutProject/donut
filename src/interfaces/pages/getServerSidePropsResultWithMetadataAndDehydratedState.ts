import { GetServerSidePropsResult } from 'next';
import { PageMetadata } from './pageMetadata.interface';
import { DehydratedState } from '@tanstack/react-query';

export type GetServerSidePropsResultWithMetadataAndServerState<T = {}> =
  GetServerSidePropsResult<
    ((PageMetadata & { dehydratedState: DehydratedState }) & T) | null
  >;
