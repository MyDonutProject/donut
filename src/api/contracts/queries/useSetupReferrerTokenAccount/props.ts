import { ContractQueryKeys } from "../../queryKeys";

export type UseSetupReferrerTokenAccountQueryKeyProps = [
  ContractQueryKeys.REFERRER_TOKEN_ACCOUNT,
  {
    referrerAddress?: string;
    address: string;
  }
];

export interface UseSetupReferrerTokenAccountProps {
  referrerAddress?: string;
}
