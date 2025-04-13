import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { Nullable } from "@/interfaces/nullable";
import * as anchor from "@project-serum/anchor";
import { web3 } from "@project-serum/anchor";
import { Provider } from "@reown/appkit-adapter-solana/react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { QueryFunctionContext } from "@tanstack/react-query";
import { UseSetupReferrerTokenAccountQueryKeyProps } from "./props";

export async function fetchSetupReferrerTokenAccount({
  queryKey,
  connection,
  walletProvider,
}: QueryFunctionContext<UseSetupReferrerTokenAccountQueryKeyProps> & {
  connection: Connection;
  walletProvider: Provider;
}) {
  try {
    const { referrerAddress: outterReferrerAddress, address } = queryKey[1];
    const myPublicKey = new PublicKey(address);

    const mainReferrerAddress = MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS;
    const referrerAddress =
      new PublicKey(outterReferrerAddress) || mainReferrerAddress;

    const referrerTokenAccount = await anchor.utils.token.associatedAddress({
      mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
      owner: referrerAddress,
    });

    try {
      const tokenAccountInfo: Nullable<anchor.web3.AccountInfo<Buffer>> =
        await connection.getAccountInfo(referrerTokenAccount);

      if (!tokenAccountInfo) {
        const createATAIx = new web3.TransactionInstruction({
          keys: [
            { pubkey: myPublicKey, isSigner: true, isWritable: true },
            { pubkey: referrerTokenAccount, isSigner: false, isWritable: true },
            { pubkey: referrerAddress, isSigner: false, isWritable: false },
            {
              pubkey: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
              isSigner: false,
              isWritable: false,
            },
            {
              pubkey: web3.SystemProgram.programId,
              isSigner: false,
              isWritable: false,
            },
            {
              pubkey: MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID,
              isSigner: false,
              isWritable: false,
            },
            {
              pubkey: web3.SYSVAR_RENT_PUBKEY,
              isSigner: false,
              isWritable: false,
            },
          ],
          programId: MAIN_ADDRESSESS_CONFIG.ASSOCIATED_TOKEN_PROGRAM_ID,
          data: Buffer.from([]),
        });

        const { blockhash } = await connection.getLatestBlockhash();

        const transaction = new Transaction({
          feePayer: myPublicKey,
          recentBlockhash: blockhash,
        }).add(createATAIx);

        const signedTx = await walletProvider.signTransaction(transaction);
        const txHash = await connection.sendRawTransaction(
          signedTx.serialize()
        );
        await connection.confirmTransaction(txHash, "confirmed");

        return txHash;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}
