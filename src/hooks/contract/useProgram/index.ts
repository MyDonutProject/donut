import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import idl from "@/constants/contract/idl.json";
import { AnchorProvider, Idl, Program } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

const PROGRAM_ID = MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID;

export function useProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  return useMemo(() => {
    if (!wallet) {
      console.log("No wallet connected");
      return {
        program: null,
      };
    }

    if (!connection) {
      console.log("No connection available");
      return {
        program: null,
      };
    }

    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });

    const program = new Program(idl as Idl, PROGRAM_ID, provider);

    return {
      program,
    };
  }, [connection, wallet]);
}
