import { makeStore, RootStore, store } from '@/store';
import type { PropsWithChildren } from 'react';
import { useRef } from 'react';
import { Provider } from 'react-redux';

export default function ReduxProvider({ children }: PropsWithChildren) {
  const storeRef = useRef<RootStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = store;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
