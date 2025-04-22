import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import { FetchUserAccountRequestDto } from "@/dto/account/fetch-user-account.dto";
import { Account } from "@/models/account";
import { PublicKey } from "@solana/web3.js";
import { QueryFunctionContext } from "@tanstack/react-query";
import { UseUserAccountQueryKeyProps } from "./props";

// Constants for optimized data reading
const CHAIN_OFFSET = 66; // 1 (is_registered) + 33 (Option<Pubkey>) + 32 (owner_wallet)
const FILLED_SLOTS_OFFSET = CHAIN_OFFSET + 4 + 33 * 3; // After chain.id and slots

export async function fetchUserAccount({
  wallet,
  program,
}: QueryFunctionContext<UseUserAccountQueryKeyProps> &
  FetchUserAccountRequestDto): Promise<Account> {
  try {
    console.log(
      "[fetchUserAccount] Starting with wallet:",
      wallet.adapter.publicKey.toString()
    );

    const [userAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_account"), wallet.adapter.publicKey.toBuffer()],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );
    console.log("[fetchUserAccount] Generated PDA:", userAccount.toString());

    // Get raw account data
    const rawAccount = await program.provider.connection.getAccountInfo(
      userAccount
    );
    if (!rawAccount) {
      console.error(
        "[fetchUserAccount] Account not found for PDA:",
        userAccount.toString()
      );
      throw new Error("Account not found");
    }
    console.log(
      "[fetchUserAccount] Raw account data length:",
      rawAccount.data.length
    );

    // Create buffer view for efficient reading
    const buffer = Buffer.from(rawAccount.data);
    console.log(
      "[fetchUserAccount] Buffer created with length:",
      buffer.length
    );

    // Skip anchor discriminator
    let offset = 8;
    console.log(
      "[fetchUserAccount] Starting offset after discriminator:",
      offset
    );

    // Read is_registered (1 byte)
    const isRegistered = buffer[offset] === 1;
    offset += 1;
    console.log("[fetchUserAccount] Is registered:", isRegistered);

    // Read referrer (Option<Pubkey>)
    const hasReferrer = buffer[offset] === 1;
    offset += 1;
    let referrer: string | null = null;
    if (hasReferrer) {
      referrer = new PublicKey(buffer.slice(offset, offset + 32)).toString();
      console.log("[fetchUserAccount] Referrer found:", referrer);
    }
    offset += 32;

    // Read owner_wallet (Pubkey)
    const ownerWallet = new PublicKey(buffer.slice(offset, offset + 32));
    offset += 32;
    console.log("[fetchUserAccount] Owner wallet:", ownerWallet.toString());

    // Read chain data
    const chainId = buffer.readUInt32LE(offset);
    offset += 4;
    console.log("[fetchUserAccount] Chain ID:", chainId);

    const filledSlots = buffer[FILLED_SLOTS_OFFSET];
    console.log("[fetchUserAccount] Filled slots:", filledSlots);

    // Read slots
    const slots: (string | null)[] = [];
    let slotOffset = offset;
    console.log(
      "[fetchUserAccount] Starting slot reading at offset:",
      slotOffset
    );
    for (let i = 0; i < 3; i++) {
      const hasSlot = buffer[slotOffset] === 1;
      slotOffset += 1;
      if (hasSlot) {
        const slotPubkey = new PublicKey(
          buffer.slice(slotOffset, slotOffset + 32)
        );
        slots.push(slotPubkey.toString());
        console.log(
          `[fetchUserAccount] Slot ${i} found:`,
          slotPubkey.toString()
        );
      } else {
        slots.push(null);
        console.log(`[fetchUserAccount] Slot ${i} is empty`);
      }
      slotOffset += 32;
    }

    // Read upline data
    const uplineOffset = FILLED_SLOTS_OFFSET + 1;
    const depth = buffer[uplineOffset];
    const uplineId = buffer.readUInt32LE(uplineOffset + 1);
    console.log("[fetchUserAccount] Upline depth:", depth);
    console.log("[fetchUserAccount] Upline ID:", uplineId);

    // Read vector length (4 bytes)
    const vecLength = buffer.readUInt32LE(uplineOffset + 5);
    let currentOffset = uplineOffset + 9;
    console.log("[fetchUserAccount] Upline vector length:", vecLength);

    // Read upline entries
    const uplineEntries = [];
    for (let i = 0; i < Math.min(vecLength, 6); i++) {
      // MAX_UPLINE_DEPTH = 6
      const pda = new PublicKey(
        buffer.slice(currentOffset, currentOffset + 32)
      );
      const wallet = new PublicKey(
        buffer.slice(currentOffset + 32, currentOffset + 64)
      );
      uplineEntries.push({
        pda: pda.toString(),
        wallet: wallet.toString(),
      });
      console.log(`[fetchUserAccount] Upline entry ${i}:`, {
        pda: pda.toString(),
        wallet: wallet.toString(),
      });
      currentOffset += 64; // Each entry is 64 bytes (32 + 32)
    }

    // Read reserved values
    const reservedSol = buffer.readBigUInt64LE(currentOffset).toString();
    const reservedTokens = buffer.readBigUInt64LE(currentOffset + 8).toString();
    console.log("[fetchUserAccount] Reserved SOL:", reservedSol);
    console.log("[fetchUserAccount] Reserved tokens:", reservedTokens);

    // Construct the optimized account object
    const account: Account = {
      isRegistered,
      referrer,
      ownerWallet: ownerWallet.toString(),
      chain: {
        id: chainId.toString(),
        slots,
        filledSlots: filledSlots,
      },
      upline: {
        id: uplineId.toString(),
        depth: depth.toString(),
        upline: uplineEntries,
      },
      reservedSol,
      reservedTokens,
    };

    console.log("[fetchUserAccount] Final account object:", account);
    return account;
  } catch (error) {
    console.error("[fetchUserAccount] Error:", error);
    console.error(
      "[fetchUserAccount] Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    throw error;
  }
}
