import { MAIN_ADDRESSESS_CONFIG } from "@/constants/contract";
import * as anchor from "@project-serum/anchor";
import { Idl, Program, web3 } from "@project-serum/anchor";
import { Connection } from "@reown/appkit-adapter-solana/react";
import { AnchorWallet, Wallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
export async function checkWsolAccount(
  userWsolAccount: PublicKey,
  connection: Connection
) {
  try {
    const wsolAccountInfo = await connection.getAccountInfo(userWsolAccount);

    if (wsolAccountInfo) {
      try {
        const tokenInfo = await connection.getTokenAccountBalance(
          userWsolAccount
        );
        const balance = Number(tokenInfo.value.amount);
        // console.log(`  Saldo atual da conta WSOL: ${balance} lamports`);
        return { exists: true, balance };
      } catch (e) {
        // console.log(`  Erro ao verificar saldo da conta WSOL: ${e.message}`);
        return { exists: true, balance: 0 };
      }
    }

    return { exists: false, balance: 0 };
  } catch (e) {
    // console.log(`  Erro ao verificar conta WSOL: ${e.message}`);
    return { exists: false, balance: 0 };
  }
}

export async function setupReferrerTokenAccount(
  referrerAddress: PublicKey,
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet
) {
  // Calcular o endereço da ATA para o referenciador
  const referrerTokenAccount = await anchor.utils.token.associatedAddress({
    mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
    owner: referrerAddress,
  });

  // Verificar se a ATA já existe
  try {
    const tokenAccountInfo = await connection.getAccountInfo(
      referrerTokenAccount
    );

    if (!tokenAccountInfo) {
      // console.log(`\n🔧 Criando ATA para o referenciador...`);

      const createATAIx = new web3.TransactionInstruction({
        keys: [
          {
            pubkey: wallet.adapter.publicKey,
            isSigner: true,
            isWritable: true,
          },
          { pubkey: referrerTokenAccount, isSigner: false, isWritable: true },
          { pubkey: referrerAddress, isSigner: false, isWritable: false },
          {
            pubkey: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SystemProgram.programId,
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

      const tx = new web3.Transaction().add(createATAIx);
      tx.feePayer = wallet.adapter.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      try {
        const signedTx = await anchorWallet.signTransaction(tx);
        const txid = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(txid, "confirmed");
        // console.log(
        //   `  ✅ ATA do referenciador criada: ${referrerTokenAccount.toString()}`
        // );
      } catch (e) {
        // console.log(`  ⚠️ Erro ao criar ATA do referenciador: ${e.message}`);

        // Verificar novamente se a ATA foi criada apesar do erro
        const verifyAccountInfo = await connection.getAccountInfo(
          referrerTokenAccount
        );
        if (verifyAccountInfo) {
          // console.log(
          //   `  ✅ ATA do referenciador existe apesar do erro: ${referrerTokenAccount.toString()}`
          // );
        } else {
          // console.log(`  ❌ ATA do referenciador não foi criada`);
        }
      }
    } else {
      // console.log(
      //   `\n✅ ATA do referenciador já existe: ${referrerTokenAccount.toString()}`
      // );
    }

    return referrerTokenAccount;
  } catch (e) {
    // console.log(`  ⚠️ Erro ao verificar ATA: ${e.message}`);
    return referrerTokenAccount;
  }
}

export async function findWalletForPDA(
  pdaAccount: any,
  connection: Connection,
  program: Program<Idl>,
  wallet: Wallet
) {
  // MÉTODO 1: Tentar derivar da transação mais antiga com mais histórico
  try {
    const signatures = await connection.getSignaturesForAddress(pdaAccount, {
      limit: 20,
    }); // Aumentar o limite

    if (signatures && signatures.length > 0) {
      // Ordenar por mais antigo primeiro (provavelmente a transação de criação)
      signatures.sort((a, b) => a.blockTime - b.blockTime);

      for (const sig of signatures) {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            commitment: "confirmed",
          });

          if (tx && tx.transaction && tx.transaction.message) {
            // Examinar todos os signers
            const signers = tx.transaction.message.accountKeys.filter(
              (k, idx) =>
                tx.transaction.message.isAccountSigner(idx) &&
                !k.equals(MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID) &&
                !k.equals(SystemProgram.programId)
            );

            // Testar cada signer para ver se deriva para este PDA
            for (const signer of signers) {
              try {
                const [derivedPDA] = PublicKey.findProgramAddressSync(
                  [Buffer.from("user_account"), signer.toBuffer()],
                  MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
                );

                if (derivedPDA.equals(pdaAccount)) {
                  // console.log(
                  //   `  ✅ Wallet encontrada via derivação de signer: ${signer.toString()}`
                  // );
                  return signer;
                }
              } catch (e) {}
            }
          }
        } catch (e) {
          // Silenciosamente falha e tenta o próximo
        }
      }
    }
  } catch (e) {}

  // MÉTODO 2: Tentar extrair do referrer na conta
  try {
    const accountInfo = await program.account.userAccount.fetch(pdaAccount);

    if (accountInfo.referrer) {
      // Verificar se referrer é a derivação
      try {
        const [derivedPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("user_account"), accountInfo.referrer.toBuffer()],
          MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
        );

        if (derivedPDA.equals(pdaAccount)) {
          // console.log(
          //   `  ✅ Wallet encontrada via campo referrer: ${accountInfo.referrer.toString()}`
          // );
          return accountInfo.referrer;
        }
      } catch (e) {}
    }

    // Verificar se algum dos slots da matriz se deriva para este PDA
    if (accountInfo.chain && accountInfo.chain.slots) {
      for (const slot of accountInfo.chain.slots) {
        if (slot) {
          try {
            const [derivedPDA] = PublicKey.findProgramAddressSync(
              [Buffer.from("user_account"), slot.toBuffer()],
              MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
            );

            if (derivedPDA.equals(pdaAccount)) {
              // console.log(
              //   `  ✅ Wallet encontrada via slot da matriz: ${slot.toString()}`
              // );
              return slot;
            }
          } catch (e) {}
        }
      }
    }
  } catch (e) {}

  // MÉTODO 3: Tentar derivar a PDA a partir de todas as carteiras nas transações
  try {
    const signatures = await connection.getSignaturesForAddress(pdaAccount, {
      limit: 30,
    });

    if (signatures && signatures.length > 0) {
      const allAccounts = new Set();

      for (const sig of signatures) {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            commitment: "confirmed",
          });

          if (tx && tx.transaction && tx.transaction.message) {
            // Coletar todas as contas da transação
            const accounts = tx.transaction.message.accountKeys;
            accounts.forEach((account) => allAccounts.add(account.toString()));
          }
        } catch (e) {
          // Silenciosamente falha e tenta o próximo
        }
      }

      // Tentar derivar PDA a partir de cada conta
      for (const accountStr of allAccounts) {
        try {
          const account = new PublicKey(accountStr);

          // Pular contas do sistema
          if (
            account.equals(SystemProgram.programId) ||
            account.equals(MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID) ||
            account.equals(MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID) ||
            account.equals(MAIN_ADDRESSESS_CONFIG.ASSOCIATED_TOKEN_PROGRAM_ID)
          ) {
            continue;
          }

          const [derivedPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_account"), account.toBuffer()],
            MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
          );

          if (derivedPDA.equals(pdaAccount)) {
            // console.log(
            //   `  ✅ Wallet encontrada via análise de todas as contas: ${account.toString()}`
            // );
            return account;
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  // Fallback
  // console.log(`  ⚠️ Não foi possível determinar a wallet para este PDA`);
  return wallet.adapter.publicKey;
}

export async function prepareUplinesForRecursion(
  uplinePDAs: any,
  referrerFilledSlots: any,
  program: Program<Idl>,
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet
) {
  const remainingAccounts = [];
  const uplinesInfo = [];

  // console.log(
  //   `\n🔄 ANALISANDO ${uplinePDAs.length} UPLINES PARA OTIMIZAÇÃO...`
  // );

  // Inicialização dos flags
  let needsPool = false;
  let needsReserve = false;
  let needsPayment = false;

  // CORREÇÃO: Definir flags com base no slot do referenciador direto primeiro
  // Isso garante que o pagamento seja processado corretamente quando o slot 2 é preenchido
  if (referrerFilledSlots === 2) {
    needsPayment = true;
    // console.log(`  ⚠️ PREENCHENDO SLOT 3 DO REFERENCIADOR - PAYMENT ATIVADO`);
  }

  // Primeiro, coletar informações sobre as uplines
  for (let i = 0; i < uplinePDAs.length; i++) {
    const uplinePDA = uplinePDAs[i];
    // console.log(`  Analisando upline ${i + 1}: ${uplinePDA.toString()}`);

    try {
      // Verificar conta do upline
      const uplineInfo = await program.account.userAccount.fetch(uplinePDA);

      if (!uplineInfo.isRegistered) {
        // console.log(`  ❌ Upline não está registrado! Ignorando.`);
        continue;
      }

      // Determinar a wallet original deste PDA
      const uplineWallet = await findWalletForPDA(
        uplinePDA,
        connection,
        program,
        wallet
      );

      // Determinar ATA para tokens (sempre necessário para prever futuros pagamentos)
      const uplineTokenAccount = await anchor.utils.token.associatedAddress({
        mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
        owner: uplineWallet,
      });

      // Criar ATA para evitar problemas futuros
      try {
        const tokenAccountInfo = await connection.getAccountInfo(
          uplineTokenAccount
        );
        if (!tokenAccountInfo) {
          // console.log(`  Criando ATA para upline...`);

          const createATAIx = new TransactionInstruction({
            keys: [
              {
                pubkey: wallet.adapter.publicKey,
                isSigner: true,
                isWritable: true,
              },
              { pubkey: uplineTokenAccount, isSigner: false, isWritable: true },
              { pubkey: uplineWallet, isSigner: false, isWritable: false },
              {
                pubkey: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
                isSigner: false,
                isWritable: false,
              },
              {
                pubkey: SystemProgram.programId,
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

          const tx = new web3.Transaction().add(createATAIx);
          tx.feePayer = wallet.adapter.publicKey;
          const { blockhash } = await connection.getLatestBlockhash();
          tx.recentBlockhash = blockhash;

          try {
            const signedTx = await anchorWallet.signTransaction(tx);
            const txid = await connection.sendRawTransaction(
              signedTx.serialize()
            );
            await connection.confirmTransaction(txid, "confirmed");
            // console.log(
            //   `  ✅ ATA criada com sucesso para upline: ${uplineTokenAccount.toString()}`
            // );
          } catch (e) {
            // console.log(
            //   `  ⚠️ Erro ao enviar transação de criação de ATA: ${e.message}`
            // );
            // Continuar tentando para garantir robustez
          }

          // Verificar se a ATA foi realmente criada
          try {
            const verifyAccountInfo = await connection.getAccountInfo(
              uplineTokenAccount
            );
            if (!verifyAccountInfo) {
              // console.log(
              //   `  ⚠️ Falha ao criar ATA, mas continuando processamento`
              // );
            } else {
              // console.log(
              //   `  ✅ ATA verificada após criação: ${uplineTokenAccount.toString()}`
              // );
            }
          } catch (e) {
            // console.log(`  ⚠️ Erro ao verificar ATA criada: ${e.message}`);
          }
        } else {
          // console.log(
          //   `  ✅ ATA já existe para upline: ${uplineTokenAccount.toString()}`
          // );
        }
      } catch (e) {
        // console.log(`  ⚠️ Erro ao criar ATA: ${e.message}`);
      }

      // Armazenar informações para ordenação
      uplinesInfo.push({
        pda: uplinePDA,
        wallet: uplineWallet,
        ata: uplineTokenAccount,
        depth: parseInt(uplineInfo.upline.depth.toString()),
        filledSlots: parseInt(uplineInfo.chain.filledSlots.toString()),
      });
    } catch (e) {
      // console.log(`  ❌ Erro ao analisar upline: ${e.message}`);
    }
  }

  // IMPORTANTE: Ordenar por profundidade DECRESCENTE (maior para menor)
  uplinesInfo.sort((a, b) => b.depth - a.depth);

  // console.log(
  //   `\n📊 ORDEM DE PROCESSAMENTO DAS UPLINES (Maior profundidade → Menor):`
  // );
  for (let i = 0; i < uplinesInfo.length; i++) {
    // console.log(
    //   `  ${i + 1}. PDA: ${uplinesInfo[i].pda.toString()} (Profundidade: ${
    //     uplinesInfo[i].depth
    //   }, Slots: ${uplinesInfo[i].filledSlots}/3)`
    // );
  }

  // NOVA LÓGICA: Encontrar o ponto de parada da recursividade
  let relevantUplines = [];

  // Verificar quantas uplines realmente precisam ser processadas
  for (let i = 0; i < uplinesInfo.length; i++) {
    const upline = uplinesInfo[i];

    // Adicionar esta upline aos relevantes
    relevantUplines.push(upline);

    // Determinar necessidades com base no slot atual para recursividade
    if (upline.filledSlots === 0) {
      // Encontrou um slot vazio (0) - o depósito irá para a pool
      // Ativamos needsPool independentemente do que foi definido anteriormente
      needsPool = true;
      // console.log(
      //   `  🛑 Encontrou slot vazio no upline ${upline.pda.toString()} - parando recursividade aqui!`
      // );
      break;
    } else if (upline.filledSlots === 1) {
      // Encontrou slot 1 (segundo slot) - o depósito será reservado
      // Ativamos needsReserve independentemente do que foi definido anteriormente
      needsReserve = true;
      // console.log(
      //   `  🛑 Encontrou slot 1 no upline ${upline.pda.toString()} - parando recursividade aqui!`
      // );
      break;
    } else if (upline.filledSlots === 2) {
      // Encontrou slot 2 (terceiro slot) - precisamos continuar
      // Não sobrescrevemos needsPayment, que pode já estar ativado pelo referenciador direto
      // console.log(
      //   `  ⏩ Encontrou slot 2 no upline ${upline.pda.toString()} - continuando recursividade...`
      // );
      // Continuar o loop para encontrar o próximo upline
    }
  }

  // console.log(
  //   `\n🔍 UPLINES RELEVANTES PARA ESTA TRANSAÇÃO: ${relevantUplines.length} de ${uplinesInfo.length}`
  // );

  // Agora adicionar apenas as uplines relevantes e suas contas específicas
  for (let i = 0; i < relevantUplines.length; i++) {
    const upline = relevantUplines[i];

    // 1. Adicionar a PDA da conta (sempre necessária)
    remainingAccounts.push({
      pubkey: upline.pda,
      isWritable: true,
      isSigner: false,
    });

    // 2. Adicionar a wallet (sempre necessária)
    remainingAccounts.push({
      pubkey: upline.wallet,
      isWritable: true,
      isSigner: false,
    });

    // 3. Adicionar a ATA apenas se for um slot 2 (pagamento de tokens)
    // ou se for o último upline relevante (que pode receber tokens posteriormente)
    if (upline.filledSlots === 2 || i === relevantUplines.length - 1) {
      remainingAccounts.push({
        pubkey: upline.ata,
        isWritable: true,
        isSigner: false,
      });
    }
  }

  // console.log(`\n📋 ANÁLISE DE NECESSIDADES OTIMIZADA:`);
  // console.log(`  Precisa de contas de pool (slot 1): ${needsPool}`);
  // console.log(`  Precisa de contas de reserva (slot 2): ${needsReserve}`);
  // console.log(`  Precisa de contas de pagamento (slot 3): ${needsPayment}`);
  // console.log(`  Total de contas adicionadas: ${remainingAccounts.length}`);

  return {
    remainingAccounts,
    needsPool,
    needsReserve,
    needsPayment,
  };
}

export async function setupVaultTokenAccount(
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet
) {
  // Derivar vault authority PDA
  const [vaultAuthority] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("token_vault_authority")],
    MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
  );

  // Calcular o endereço do vault de tokens
  const programTokenVault = await anchor.utils.token.associatedAddress({
    mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
    owner: vaultAuthority,
  });

  // Verificar se a ATA já existe
  try {
    const vaultAccountInfo = await connection.getAccountInfo(programTokenVault);

    if (!vaultAccountInfo) {
      // console.log(`\n🔧 Criando ATA para o vault do programa...`);

      const createVaultATAIx = new web3.TransactionInstruction({
        keys: [
          {
            pubkey: wallet.adapter.publicKey,
            isSigner: true,
            isWritable: true,
          },
          { pubkey: programTokenVault, isSigner: false, isWritable: true },
          { pubkey: vaultAuthority, isSigner: false, isWritable: false },
          {
            pubkey: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SystemProgram.programId,
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

      const tx = new web3.Transaction().add(createVaultATAIx);
      tx.feePayer = wallet.adapter.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      try {
        const signedTx = await anchorWallet.signTransaction(tx);
        const txid = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(txid, "confirmed");
        // console.log(
        //   `  ✅ ATA do vault criada: ${programTokenVault.toString()}`
        // );
      } catch (e) {
        // console.log(`  ⚠️ Erro ao criar ATA do vault: ${e.message}`);

        // Verificar novamente se a ATA foi criada apesar do erro
        const verifyAccountInfo = await connection.getAccountInfo(
          programTokenVault
        );
        if (verifyAccountInfo) {
          // console.log(
          //   `  ✅ ATA do vault existe apesar do erro: ${programTokenVault.toString()}`
          // );
        }
      }
    } else {
      // console.log(
      //   `\n✅ ATA do vault já existe: ${programTokenVault.toString()}`
      // );
    }

    return programTokenVault;
  } catch (e) {
    // console.log(`  ⚠️ Erro ao verificar ATA do vault: ${e.message}`);
    return programTokenVault;
  }
}

export async function phase2_registerUser(
  phase1Data: any,
  connection: Connection,
  wallet: Wallet,
  anchorWallet: AnchorWallet,
  program: Program<Idl>
) {
  if (!phase1Data) {
    // console.error(
    //   "❌ Dados da Fase 1 não disponíveis. Execute a Fase 1 primeiro."
    // );
    return;
  }

  try {
    // console.log("\n🚀 FASE 2: REGISTRO DE USUÁRIO 🚀");
    // console.log("=======================================");

    const {
      depositAmount,
      userAccount,
      userWsolAccount,
      referrerAccount,
      referrerTokenAccount,
      programTokenVault,
      uplinesData,
    } = phase1Data;

    // Derivar PDAs necessárias
    const [tokenMintAuthority] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("token_mint_authority")],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    const [vaultAuthority] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("token_vault_authority")],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    const [programSolVault] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("program_sol_vault")],
      MAIN_ADDRESSESS_CONFIG.MATRIX_PROGRAM_ID
    );

    // console.log("\n📤 ENVIANDO TRANSAÇÃO DE REGISTRO OTIMIZADA...");
    // console.log(
    //   `  Flags ativados: Pool=${uplinesData.needsPool}, Reserve=${uplinesData.needsReserve}, Payment=${uplinesData.needsPayment}`
    // );

    // CORREÇÃO: Garantir que as contas pool sejam incluídas quando needsPool é true
    // Isso é importante para recursividade
    const accounts = {
      // Contas básicas (sempre necessárias)
      state: MAIN_ADDRESSESS_CONFIG.STATE_ADDRESS,
      userWallet: wallet.adapter.publicKey,
      referrer: referrerAccount,
      referrerWallet: MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS,
      user: userAccount,
      userWsolAccount: userWsolAccount,
      wsolMint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
      pythSolUsdPrice: MAIN_ADDRESSESS_CONFIG.PYTH_SOL_USD,

      // Contas opcionais específicas de Pool (Slot 1)
      pool: uplinesData.needsPool ? MAIN_ADDRESSESS_CONFIG.POOL_ADDRESS : null,
      bVault: uplinesData.needsPool ? MAIN_ADDRESSESS_CONFIG.B_VAULT : null,
      bTokenVault: uplinesData.needsPool
        ? MAIN_ADDRESSESS_CONFIG.B_TOKEN_VAULT
        : null,
      bVaultLpMint: uplinesData.needsPool
        ? MAIN_ADDRESSESS_CONFIG.B_VAULT_LP_MINT
        : null,
      bVaultLp: uplinesData.needsPool
        ? MAIN_ADDRESSESS_CONFIG.B_VAULT_LP
        : null,
      vaultProgram: uplinesData.needsPool
        ? MAIN_ADDRESSESS_CONFIG.VAULT_PROGRAM
        : null,

      // Contas sempre necessárias
      programSolVault: programSolVault,
      tokenMint: MAIN_ADDRESSESS_CONFIG.TOKEN_MINT,
      programTokenVault: programTokenVault,

      // Conta opcional para pagamento (Slot 3)
      referrerTokenAccount: uplinesData.needsPayment
        ? referrerTokenAccount
        : null,

      // Outras contas necessárias
      tokenMintAuthority: tokenMintAuthority,
      vaultAuthority: vaultAuthority,
      tokenProgram: MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      associatedTokenProgram:
        MAIN_ADDRESSESS_CONFIG.ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
    };

    // CORREÇÃO: Verificar e imprimir informações detalhadas para depuração
    if (uplinesData.needsPayment) {
      try {
        const referrerTokenInfo = await connection.getAccountInfo(
          referrerTokenAccount
        );
        if (!referrerTokenInfo) {
          // console.log(
          //   "⚠️ AVISO: ATA do referenciador não existe! Tentando criar..."
          // );
          await setupReferrerTokenAccount(
            MAIN_ADDRESSESS_CONFIG.REFERRER_ADDRESS,
            connection,
            wallet,
            anchorWallet
          );
        } else {
          // console.log("✅ Confirmado: ATA do referenciador existe!");
        }
      } catch (e) {
        // console.log(`⚠️ Erro ao verificar ATA do referenciador: ${e.message}`);
      }
    }

    try {
      // Usar o método otimizado da forma correta
      // console.log("🔄 Enviando transação...");
      const tx = await program.methods
        .registerWithSolDepositOptimized(
          depositAmount,
          uplinesData.needsPool,
          uplinesData.needsReserve,
          uplinesData.needsPayment
        )
        .accounts(accounts)
        .remainingAccounts(uplinesData.remainingAccounts)
        .rpc({
          skipPreflight: true,
          commitment: "confirmed",
        });

      // console.log("✅ TRANSAÇÃO ENVIADA: " + tx);
      // console.log(
      //   `🔍 Link para explorador: https://explorer.solana.com/tx/${tx}?cluster=devnet`
      // );

      // console.log("\n⏳ AGUARDANDO CONFIRMAÇÃO...");
      await connection.confirmTransaction(tx, "confirmed");
      // console.log("✅ TRANSAÇÃO CONFIRMADA!");
    } catch (e) {
      // console.error("❌ ERRO AO ENVIAR TRANSAÇÃO:", e);

      if (e.logs) {
        // console.log("📋 LOGS DE ERRO:");
        // e.logs.forEach((log) => console.log(`  ${log}`));
      }

      throw e; // Reenviar erro para tratamento externo
    }

    // Verificar resultados
    // console.log("\n🔍 VERIFICANDO RESULTADOS...");

    try {
      // Verificar estado da conta do usuário
      const userInfo = await program.account.userAccount.fetch(userAccount);
      // console.log("\n📋 CONFIRMAÇÃO DO REGISTRO:");
      // console.log("✅ Usuário registrado: " + userInfo.isRegistered);
      // console.log("🧑‍🤝‍🧑 Referenciador: " + userInfo.referrer.toString());
      // console.log("🔢 Profundidade: " + userInfo.upline.depth.toString());
      // console.log("📊 Slots preenchidos: " + userInfo.chain.filledSlots + "/3");

      // Verificar o estado do referenciador após o registro
      const newReferrerInfo = await program.account.userAccount.fetch(
        referrerAccount
      );
      // console.log("\n📋 ESTADO DO REFERENCIADOR APÓS REGISTRO:");
      // console.log(
      //   "📊 Slots preenchidos: " + newReferrerInfo.chain.filledSlots + "/3"
      // );

      // Verificar a conta WSOL - deve estar fechada após a transação
      const wsolInfo = await connection.getAccountInfo(userWsolAccount);
      if (!wsolInfo || wsolInfo.data.length === 0) {
        // console.log(
        //   "\n✅ Conta WSOL foi fechada corretamente após o processamento"
        // );
      } else {
        // console.log("\n⚠️ Conta WSOL ainda está aberta após o processamento");

        // Fechar a conta WSOL manualmente se ainda estiver aberta
        // console.log("🧹 Tentando fechar conta WSOL...");
        try {
          const closeIx = new web3.TransactionInstruction({
            keys: [
              { pubkey: userWsolAccount, isSigner: false, isWritable: true },
              {
                pubkey: wallet.adapter.publicKey,
                isSigner: false,
                isWritable: true,
              },
              {
                pubkey: wallet.adapter.publicKey,
                isSigner: true,
                isWritable: false,
              },
            ],
            programId: MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID,
            data: Buffer.from([9]), // Comando CloseAccount
          });

          const closeTx = new web3.Transaction().add(closeIx);
          closeTx.feePayer = wallet.adapter.publicKey;
          const { blockhash } = await connection.getLatestBlockhash();
          closeTx.recentBlockhash = blockhash;

          const signedCloseTx = await anchorWallet.signTransaction(closeTx);
          const closeTxid = await connection.sendRawTransaction(
            signedCloseTx.serialize()
          );
          await connection.confirmTransaction(closeTxid, "confirmed");
          // console.log("✅ Conta WSOL fechada manualmente com sucesso");
        } catch (e) {
          // console.log("⚠️ Erro ao fechar conta WSOL manualmente: " + e.message);
        }
      }

      // Obter e mostrar o novo saldo
      const newBalance = await connection.getBalance(wallet.adapter.publicKey);
      // console.log("\n💼 Seu novo saldo: " + newBalance / 1e9 + " SOL");

      console.log("\n🎉 Register Success! 🎉");
      console.log("=========================================================");
      console.log("\n⚠️ IMPORTANT: SAVE THESE ADDRESSES FOR FUTURE USE:");
      console.log("🔑 YOUR ADDRESS: " + wallet.adapter.publicKey.toString());
      console.log("🔑 YOUR PDA: " + userAccount.toString());

      // Verificar as uplines que foram modificadas
      if (uplinesData.remainingAccounts.length > 0) {
        console.log("\n📋 Upline verification:");

        // Verificar apenas as PDAs (a cada 2 ou 3 contas)
        for (let i = 0; i < uplinesData.remainingAccounts.length; i += 2) {
          if (i < uplinesData.remainingAccounts.length) {
            const uplinePDA = uplinesData.remainingAccounts[i].pubkey;
            try {
              const uplineInfo = await program.account.userAccount.fetch(
                uplinePDA
              );
              console.log(
                `  Upline ${uplinePDA.toString()}: Filled slots: ${
                  uplineInfo.chain.filledSlots
                }/3`
              );
            } catch (e) {
              console.log(
                `  ⚠️ Error verifying upline ${uplinePDA.toString()}: ${
                  e.message
                }`
              );
            }
          }
        }
      }
    } catch (e) {
      console.error("❌ ERROR VERIFYING RESULTS:", e);
    }
  } catch (error) {
    console.error("❌ GENERAL ERROR IN PHASE 2:", error);

    // Se houver erro, verificar a conta WSOL e tentar fechá-la para recuperar fundos
    try {
      const userWsolAccount = await anchor.utils.token.associatedAddress({
        mint: MAIN_ADDRESSESS_CONFIG.WSOL_MINT,
        owner: wallet.adapter.publicKey,
      });

      const wsolInfo = await connection.getAccountInfo(userWsolAccount);
      if (wsolInfo && wsolInfo.data.length > 0) {
        // console.log("\n🧹 Tentando fechar conta WSOL para recuperar fundos...");
        const closeIx = new web3.TransactionInstruction({
          keys: [
            { pubkey: userWsolAccount, isSigner: false, isWritable: true },
            {
              pubkey: wallet.adapter.publicKey,
              isSigner: false,
              isWritable: true,
            },
            {
              pubkey: wallet.adapter.publicKey,
              isSigner: true,
              isWritable: false,
            },
          ],
          programId: MAIN_ADDRESSESS_CONFIG.SPL_TOKEN_PROGRAM_ID,
          data: Buffer.from([9]), // Comando CloseAccount
        });

        const closeTx = new web3.Transaction().add(closeIx);
        closeTx.feePayer = wallet.adapter.publicKey;
        const { blockhash } = await connection.getLatestBlockhash();
        closeTx.recentBlockhash = blockhash;

        const signedCloseTx = await anchorWallet.signTransaction(closeTx);
        const closeTxid = await connection.sendRawTransaction(
          signedCloseTx.serialize()
        );
        await connection.confirmTransaction(closeTxid, "confirmed");
        // console.log("✅ Conta WSOL fechada e fundos recuperados");
      }
    } catch (e) {
      // Ignorar erros aqui
    }
  }
}
