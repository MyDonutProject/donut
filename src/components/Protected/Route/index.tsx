import { PropsWithChildren } from 'react';
import useAccount from '@/hooks/account/useAccount';
import { useRouter } from 'next/router';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isConnected } = useAccount();
  const { push } = useRouter();

  if (!isConnected) {
    push('/');
  }

  return <>{children}</>;
}
