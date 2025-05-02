import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import Router from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function useAccount() {
  const [balance, setBalance] = useState<number>(0);
  const wallet = useWallet();
  const address = wallet.publicKey?.toBase58();

  const { connection } = useConnection();
  const myPublicKey = !!wallet.publicKey
    ? new PublicKey(wallet.publicKey)
    : null;

  function effectToGetBalance() {
    if (wallet.connected === false) {
      return;
    }

    const handleGetBalance = async () => {
      if (!myPublicKey) {
        return;
      }

      const balance = await connection?.getBalance(myPublicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    };

    if (!myPublicKey || !connection) {
      return;
    }

    handleGetBalance();
  }

  useEffect(effectToGetBalance, [myPublicKey, connection, wallet.connected]);

  const isSkeleton = !wallet.connected && wallet.connecting;
  const isConnected = wallet.connected || wallet.connecting;

  const handleDisconnectTimeout = useCallback(() => {
    if (
      wallet.disconnecting ||
      (wallet.connected === false && Router.pathname !== "/")
    ) {
      Router.push("/");
    }

    if (wallet.connected && Router.pathname === "/") {
      Router.push("/dashboard");
    }
  }, [wallet]);

  useEffect(handleDisconnectTimeout, [handleDisconnectTimeout]);

  return {
    isConnected,
    isSkeleton,
    balance,
    myPublicKey,
    connection,
    address,
  };
}
