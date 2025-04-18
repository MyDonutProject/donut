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
    console.log("Starting fetchSetupReferrerTokenAccount...");

    const { referrerAddress: outterReferrerAddress, address } = queryKey[1];
    console.log("Referrer address from query:", outterReferrerAddress);
    console.log("User address:", address);

    const myPublicKey = new PublicKey(address);
    console.log("Created PublicKey from address:", myPublicKey.toBase58());

    const mainReferrerAddress = MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS;
    const referrerAddress = outterReferrerAddress
      ? new PublicKey(outterReferrerAddress)
      : mainReferrerAddress;
    console.log("Using referrer address:", referrerAddress.toBase58());

    const referrerTokenAccount = await anchor.utils.token.associatedAddress({
      mint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
      owner: referrerAddress,
    });
    console.log(
      "Generated referrer token account:",
      referrerTokenAccount.toBase58()
    );

    try {
      console.log("Checking if token account exists...");
      const tokenAccountInfo: Nullable<anchor.web3.AccountInfo<Buffer>> =
        await connection.getAccountInfo(referrerTokenAccount);

      if (!tokenAccountInfo) {
        console.log("Token account does not exist, creating new ATA...");

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

        console.log("Created ATA instruction");
        console.log("Getting latest blockhash...");
        const { blockhash } = await connection.getLatestBlockhash();

        const transaction = new Transaction({
          feePayer: myPublicKey,
          recentBlockhash: blockhash,
        }).add(createATAIx);

        console.log("Created transaction, requesting signature...");
        const signedTx = await anchorWallet.signTransaction(transaction);

        console.log("Transaction signed, sending to network...");
        const txHash = await connection.sendRawTransaction(
          signedTx.serialize()
        );

        console.log("Transaction sent, hash:", txHash);
        console.log("Waiting for confirmation...");

        await connection.confirmTransaction(txHash, "confirmed");
        console.log("Transaction confirmed!");

        return txHash;
      } else {
        console.log("Token account already exists");
        return null;
      }
    } catch (error) {
      console.error("Inner error in fetchSetupReferrerTokenAccount:", error);
      throw error;
    }
  } catch (error) {
    console.error("Outer error in fetchSetupReferrerTokenAccount:", error);
    throw error;
  }
}
