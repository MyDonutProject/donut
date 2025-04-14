import { ParsedTransactionWithMeta } from "@solana/web3.js";

import { ParsedInstruction } from "@solana/web3.js";

export interface TokenDetails {
  mint: any;
  amount: any;
  source: any;
  destination: any;
  authority: any;
}

export interface ProcessedTransactions {
  signature: string;
  timestamp: Date;
  type: string;
  summary: {
    byToken: {
      incoming: number;
      outgoing: number;
      net: number;
      tokenId: string;
    }[];
    totalTokens: number;
    hasIncoming: boolean;
    hasOutgoing: boolean;
    ownerAddress: string;
  };
  tokenInstructions: ParsedInstruction[];
  tokenDetails: TokenDetails[];
  raw: ParsedTransactionWithMeta;
}
