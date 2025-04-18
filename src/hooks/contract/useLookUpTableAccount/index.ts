import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { useConnection } from "@solana/wallet-adapter-react";
import { useCallback } from "react";

export function useGetLookUpTableAccount() {
  const { connection } = useConnection();

  const getLookupTableAccount = useCallback(async () => {
    return await connection.getAddressLookupTable(
      MAIN_ADDRESSESS_CONFIG.LOOKUP_TABLE_ADDRESS
    );
  }, [connection]);

  return { getLookupTableAccount };
}
