import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { Nullable } from "@/interfaces/nullable";
import * as anchor from "@project-serum/anchor";
import { web3 } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { QueryFunctionContext } from "@tanstack/react-query";
import { UseSetupReferrerTokenAccountQueryKeyProps } from "./props";

export async function fetchSetupReferrerTokenAccount({
  queryKey,
  connection,
  anchorWallet,
}: QueryFunctionContext<UseSetupReferrerTokenAccountQueryKeyProps> & {
  connection: Connection;
  anchorWallet: AnchorWallet;
}) {
  try {
    console.log("[fetchSetupReferrerTokenAccount] Starting...");
    const { referrerAddress: outterReferrerAddress, address } = queryKey[1];
    console.log("[fetchSetupReferrerTokenAccount] Addresses:", {
      outterReferrerAddress,
      address,
    });

    const myPublicKey = new PublicKey(address);
    console.log(
      "[fetchSetupReferrerTokenAccount] My public key:",
      myPublicKey.toString()
    );

    const mainReferrerAddress = MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS;
    const referrerAddress =
      new PublicKey(outterReferrerAddress) || mainReferrerAddress;
    console.log(
      "[fetchSetupReferrerTokenAccount] Referrer address:",
      referrerAddress.toString()
    );

    const referrerTokenAccount = await anchor.utils.token.associatedAddress({
      mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
      owner: referrerAddress,
    });
    console.log(
      "[fetchSetupReferrerTokenAccount] Referrer token account:",
      referrerTokenAccount.toString()
    );

    try {
      const tokenAccountInfo: Nullable<anchor.web3.AccountInfo<Buffer>> =
        await connection.getAccountInfo(referrerTokenAccount);
      console.log(
        "[fetchSetupReferrerTokenAccount] Token account info:",
        tokenAccountInfo
      );

      if (!tokenAccountInfo) {
        console.log("[fetchSetupReferrerTokenAccount] Creating new ATA...");
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
        console.log("[fetchSetupReferrerTokenAccount] Created ATA instruction");

        const { blockhash } = await connection.getLatestBlockhash();
        console.log(
          "[fetchSetupReferrerTokenAccount] Got latest blockhash:",
          blockhash
        );

        const transaction = new Transaction({
          feePayer: myPublicKey,
          recentBlockhash: blockhash,
        }).add(createATAIx);
        console.log("[fetchSetupReferrerTokenAccount] Created transaction");

        const signedTx = await anchorWallet.signTransaction(transaction);
        console.log("[fetchSetupReferrerTokenAccount] Signed transaction");

        const txHash = await connection.sendRawTransaction(
          signedTx.serialize()
        );
        console.log(
          "[fetchSetupReferrerTokenAccount] Sent transaction:",
          txHash
        );

        await connection.confirmTransaction(txHash, "confirmed");
        console.log("[fetchSetupReferrerTokenAccount] Transaction confirmed");

        return txHash;
      }
      console.log("[fetchSetupReferrerTokenAccount] ATA already exists");
    } catch (error) {
      console.error("[fetchSetupReferrerTokenAccount] Inner error:", error);
      throw error;
    }
  } catch (error) {
    console.error("[fetchSetupReferrerTokenAccount] Outer error:", error);
    throw error;
  }
}
