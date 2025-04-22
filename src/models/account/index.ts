export interface Account {
  isRegistered: boolean;
  referrer: string;
  ownerWallet: any;
  upline: {
    id: string;
    depth: string;
    upline: string[];
  };
  chain: {
    id: string;
    slots: (string | null)[];
    filledSlots: number;
  };
  reservedSol: string;
  reservedTokens: string;
}
