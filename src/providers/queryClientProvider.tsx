import { GenericError } from '@/models/generic-error';
import { ErrorService } from '@/services/error-service';
import {
  QueryClient,
  QueryClientProvider as LibQueryClientProvider,
  QueryClientConfig,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PropsWithChildren } from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError(error: unknown) {
        ErrorService.onError(error as AxiosError<GenericError>);
      },
    },
  },
});

export default function QueryClientProvider({ children }: PropsWithChildren) {
  return (
    <LibQueryClientProvider client={queryClient}>
      {children}
    </LibQueryClientProvider>
  );
}
