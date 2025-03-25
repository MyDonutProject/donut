import { useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { useAppKit } from '@reown/appkit/react';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ModalsKey } from '@/enums/modalsKey';

export default function useAccount() {
  const {
    isConnected: appKitIsConnected,
    address,
    status,
  } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { push } = useRouter();

  const { open } = useAppKit();
  const isSkeleton = !appKitIsConnected && status === 'connecting';
  const isConnected = appKitIsConnected || status === 'connected';
  

  const handleDisconnectTimeout = useCallback(() => {
    if (status === 'connecting') {
      const timeout = setTimeout(() => {
        disconnect();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [status, disconnect]);

  useEffect(handleDisconnectTimeout, [handleDisconnectTimeout]);

  const handleOpenAuthModal = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const isMobile = window.innerWidth < 768;

    if (isConnected && !isMobile) {
      open({
        view: 'Account',
      });
      return;
    }

    if (isMobile) {
      push({
        hash: ModalsKey.ProfileDetails
      });
      return;
    }

    open({
      view: 'Connect',
      namespace: 'solana',
    });
  }, [isConnected, open]);

  return {
    isConnected,
    address,
    status,
    isSkeleton,
    handleOpenAuthModal,
  };
}
