import { ModalsKey } from "@/enums/modalsKey";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function useAccount() {
  const [balance, setBalance] = useState<number>(0);
  const {
    isConnected: appKitIsConnected,
    address,
    status,
  } = useAppKitAccount();
  const { connection } = useAppKitConnection();

  function effectToGetBalance() {
    const handleGetBalance = async () => {
      const wallet = new PublicKey(address);
      const balance = await connection?.getBalance(wallet);
      setBalance(balance / LAMPORTS_PER_SOL);
    };

    if (!address || !connection) {
      return;
    }

    handleGetBalance();
  }

  useEffect(effectToGetBalance, [address, connection]);
  const { disconnect } = useDisconnect();
  const { push } = useRouter();

  const { open } = useAppKit();
  const isSkeleton = !appKitIsConnected && status === "connecting";
  const isConnected = appKitIsConnected || status === "connected";

  const handleDisconnectTimeout = useCallback(() => {
    if (status === "connecting") {
      const timeout = setTimeout(() => {
        disconnect();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [status, disconnect]);

  useEffect(handleDisconnectTimeout, [handleDisconnectTimeout]);

  const handleOpenAuthModal = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const isMobile = window.innerWidth < 768;

    if (isConnected && !isMobile) {
      open({
        view: "Account",
      });
      return;
    }

    if (isMobile) {
      push({
        hash: ModalsKey.ProfileDetails,
      });
      return;
    }

    open({
      view: "Connect",
      namespace: "solana",
    });
  }, [isConnected, open]);

  return {
    isConnected,
    address,
    status,
    isSkeleton,
    handleOpenAuthModal,
    balance,
  };
}
