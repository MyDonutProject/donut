import { ErrorService } from "@/services/error-service";
import { NotificationsService } from "@/services/NotificationService";
import { store } from "@/store";
import { Idl, Program } from "@project-serum/anchor";
import { AnchorWallet, Wallet } from "@solana/wallet-adapter-react";
import {
  AddressLookupTableAccount,
  Connection,
  RpcResponseAndContext,
} from "@solana/web3.js";
import { registerWithSolDepositV3 } from "./utils";

export async function fetchPrepareAccounts({
  amount,
  connection,
  program,
  wallet,
  anchorWallet,
  notificationService,
  getLookupTableAccount,
}: {
  amount: string;
  connection: Connection;
  program: Program<Idl>;
  wallet: Wallet;
  anchorWallet: AnchorWallet;
  notificationService: NotificationsService<typeof store>;
  getLookupTableAccount: () => Promise<
    RpcResponseAndContext<AddressLookupTableAccount>
  >;
}) {
  try {
    const lookupTableAccountResponse = await getLookupTableAccount();
    if (!lookupTableAccountResponse?.value) {
      throw new Error("Lookup table not found");
    }

    return await registerWithSolDepositV3({
      amount,
      connection,
      program,
      wallet,
      anchorWallet,
      notificationService,
      lookupTableAccount: lookupTableAccountResponse.value,
    });
  } catch (err) {
    ErrorService.onError(err);
    notificationService.error({
      title: "error_preparing_accounts_title",
      message: "error_preparing_accounts_description",
    });
    throw err;
  }
}
