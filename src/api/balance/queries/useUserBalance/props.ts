import { BalanceQueryKeys } from "../../queryKeys";

export type UseUserBalanceQueryKeyProps = [BalanceQueryKeys.Balance];

export type UserBalance = {
  isRegistered: boolean;
  reservedSol: string;
  reservedTokens: string;
  formattedSol: number;
  formattedTokens: number;
};
