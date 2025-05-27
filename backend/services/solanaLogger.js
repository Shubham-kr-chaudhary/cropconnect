
/**
 * Stubbed on-chain logger.
 * Always returns a fake signature immediately.
 */
async function logTransactionOnChain({ cropId, farmerPubkey, firmPubkey, quantity, amount }) {
  console.warn("⚠️  Skipping on-chain log (stub).");
  return "STUB_SIGNATURE_" + Date.now();
}

module.exports = { logTransactionOnChain };


// require("dotenv").config();
// const path    = require("path");
// const anchor  = require("@coral-xyz/anchor");
// const {
//   Connection,
//   Keypair,
//   PublicKey,
//   SystemProgram,
// } = require("@solana/web3.js");

// // 1) RPC & provider
// const connection = new Connection(process.env.RPC_URL, "confirmed");
// const authority  = Keypair.fromSecretKey(
//   Uint8Array.from(JSON.parse(process.env.SOLANA_SECRET_KEY))
// );
// const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(authority), {});
// anchor.setProvider(provider);

// // 2) Load IDL (correct filename!)
// const PROGRAM_ID = new PublicKey(process.env.SOLANA_PROGRAM_ID.trim());
// const idlPath    = path.join(
//   __dirname, "..","..", "solana", "target", "idl", "solana.json"
// );
// const idl        = require(idlPath);

// // 3) Strip out account clients to avoid `size` errors
// delete idl.accounts;

// // 4) Instantiate your program
// const program = new anchor.Program(idl, PROGRAM_ID, provider);

// async function logTransactionOnChain({ cropId, farmerPubkey, firmPubkey, quantity, amount }) {
//   // a) Prepare inputs
//   const bnCrop  = new anchor.BN(cropId);
//   const bnQty   = new anchor.BN(quantity);
//   const bnAmt   = new anchor.BN(amount);
//   const farmerPK= new PublicKey(farmerPubkey.trim());
//   const firmPK  = new PublicKey(firmPubkey.trim());

//   // b) Derive PDA
//   const [recordPda] = PublicKey.findProgramAddressSync(
//     [Buffer.from("record"), authority.publicKey.toBuffer(), Buffer.from(bnCrop.toString())],
//     PROGRAM_ID
//   );

//   // c) Call via the new methods API
//   const txSig = await program
//     .methods
//     .logTransaction(bnCrop, farmerPK, firmPK, bnQty, bnAmt)
//     .accounts({
//       record:        recordPda,
//       authority:     authority.publicKey,
//       systemProgram: SystemProgram.programId,
//     })
//     .rpc();

//   console.log("✅ On‐chain signature:", txSig);
//   return txSig;
// }

// module.exports = { logTransactionOnChain };



// const fs = require('fs');
// const path = require('path');
// const anchor = require('@coral-xyz/anchor');

// // Load the IDL using a relative Linux-compatible path
// const idlPath = path.resolve(__dirname, '../../solana/target/idl/solana.json');
// const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));

// // Configure the Anchor provider (reads environment variables ANCHOR_PROVIDER_URL and ANCHOR_WALLET)
// const provider = anchor.AnchorProvider.local();
// anchor.setProvider(provider);

// // Create the program interface using the IDL and program ID
// // const programId = new anchor.web3.PublicKey(idl.metadata?.address || idl.address);
// const programId = new anchor.web3.PublicKey(process.env.SOLANA_PROGRAM_ID.trim());
// const program = new anchor.Program(idl, programId, provider);

// /**
//  * Sends a transaction to the Solana chain using the Anchor program's 'confirmOrder' instruction.
//  * @param {string} cropName - The name of the crop.
//  * @param {number|string} quantity - The quantity of the crop (numeric or string).
//  * @param {string} buyerPubkey - The buyer's public key (string or PublicKey).
//  * @returns {Promise<string>} - The transaction signature on success.
//  */
// async function logTransactionOnChain(cropName, quantity, buyerPubkey) {
//   // Convert buyerPubkey to PublicKey
//   const buyerKey = new anchor.web3.PublicKey(buyerPubkey);
//   const qtyBN = new anchor.BN(quantity);

//   try {
//     // Send the transaction using the 'confirmOrder' instruction from the Anchor program
//     const txSignature = await program.rpc.confirmOrder(
//       cropName,
//       qtyBN,
//       buyerKey,
//       {
//         accounts: {
//           // Example: include the system program (commonly required)
//           systemProgram: anchor.web3.SystemProgram.programId,
//           // Add other accounts (e.g., buyer, order account) if required by your program
//         },
//         // signers: [], // Include if any non-program-derived account must sign
//       }
//     );
//     console.log("Transaction sent:", txSignature);
//     return txSignature;
//   } catch (error) {
//     console.error("Error sending transaction:", error);
//     throw error;
//   }
// }

// module.exports = { logTransactionOnChain };


// services/solanaLogger.js

// require("dotenv").config();
// const fs      = require("fs");
// const path    = require("path");
// const anchor  = require("@coral-xyz/anchor");
// const { PublicKey, SystemProgram, Transaction, TransactionInstruction } = require("@solana/web3.js");

// // ——— 1) Provider & Wallet ———
// // AnchorProvider.local() will:
// //  • use RPC_URL if set, else default to http://127.0.0.1:8899
// //  • read keypair from ANCHOR_WALLET
// const provider = anchor.AnchorProvider.local();
// anchor.setProvider(provider);

// // ——— 2) Load IDL & Program ———
// const idlPath = path.resolve(__dirname, "../../solana/target/idl/solana.json");
// if (!fs.existsSync(idlPath)) throw new Error("Cannot find IDL at " + idlPath);
// const idl       = JSON.parse(fs.readFileSync(idlPath, "utf8"));
// const programId = new PublicKey(process.env.SOLANA_PROGRAM_ID.trim());
// const program   = new anchor.Program(idl, programId, provider);

// // ——— 3) The logger function ———
// async function logTransactionOnChain({ cropId, farmerPubkey, firmPubkey, quantity, amount }) {
//   // Convert to BNs & PublicKeys
//   const bnCrop  = new anchor.BN(cropId, 10);
//   const bnQty   = new anchor.BN(quantity, 10);
//   const bnAmt   = new anchor.BN(amount, 10);
//   const farmer  = new PublicKey(farmerPubkey);
//   const firm    = new PublicKey(firmPubkey);

//   // Derive the same PDA your Rust program uses
//   const [recordPda] = PublicKey.findProgramAddressSync(
//     [
//       Buffer.from("record"),
//       provider.wallet.publicKey.toBuffer(),
//       Buffer.from(bnCrop.toString()),
//     ],
//     program.programId
//   );

//   // Encode the instruction data with Anchor’s coder
//   const data = program.coder.instruction.encode("log_transaction", {
//     crop_id:  bnCrop,
//     farmer,
//     firm,
//     quantity: bnQty,
//     amount:   bnAmt,
//   });

//   // Build account metas exactly as in your Rust
//   const keys = [
//     { pubkey: recordPda,           isSigner: false, isWritable: true  },
//     { pubkey: provider.wallet.publicKey, isSigner: true,  isWritable: true  },
//     { pubkey: SystemProgram.programId,   isSigner: false, isWritable: false },
//   ];

//   // Create & send the instruction
//   const ix = new TransactionInstruction({ programId, keys, data });
//   const tx = new Transaction().add(ix);
//   const sig = await provider.sendAndConfirm(tx, [provider.wallet.payer]);

//   console.log("✅ On-chain signature:", sig);
//   return sig;
// }

// module.exports = { logTransactionOnChain };


// // services/solanaLogger.js
// require("dotenv").config();
// const fs     = require("fs");
// const path   = require("path");
// const anchor = require("@coral-xyz/anchor");
// const {
//   Connection,
//   PublicKey,
//   SystemProgram,
//   Transaction,
//   Keypair,
//   TransactionInstruction,
// } = require("@solana/web3.js");

// // 1) RPC & Connection
// const RPC_URL = process.env.RPC_URL?.trim();
// if (!RPC_URL) throw new Error("RPC_URL must be set in .env");
// const connection = new Connection(RPC_URL, "confirmed");

// // 2) Authority Keypair
// let authority;
// try {
//   const raw = JSON.parse(process.env.SOLANA_SECRET_KEY);
//   authority = Keypair.fromSecretKey(Uint8Array.from(raw));
// } catch (e) {
//   throw new Error("Failed to parse SOLANA_SECRET_KEY: " + e.message);
// }

// // 3) Anchor Provider
// const provider = new anchor.AnchorProvider(
//   connection,
//   new anchor.Wallet(authority),
//   {}
// );
// anchor.setProvider(provider);

// // 4) Load the _full_ IDL (including `accounts`)
// const PROGRAM_ID = new PublicKey(process.env.SOLANA_PROGRAM_ID.trim());
// const idlPath    = path.resolve(
//   __dirname,
//   "../../solana/target/idl/solana.json"
// );
// if (!fs.existsSync(idlPath)) {
//   throw new Error(`IDL not found at ${idlPath}`);
// }
// const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
// // — Do NOT delete idl.accounts

// // 5) Instantiate the Anchor program client
// const program = new anchor.Program(idl, PROGRAM_ID, provider);

// /**
//  * Real on-chain log: calls `confirm_order` in your Rust program
//  * @param {{ cropName: string, quantity: number, buyerPubkey: string }} opts
//  * @returns {Promise<string>} the tx signature
//  */
// async function logTransactionOnChain({ cropName, quantity, buyerPubkey }) {
//   // a) Validate inputs
//   if (typeof cropName !== "string") throw new Error("cropName must be a string");
//   const qtyBN    = new anchor.BN(quantity);
//   const buyerKey = new PublicKey(buyerPubkey);

//   // b) Derive the PDA exactly as in Rust:
//   const [orderPda] = PublicKey.findProgramAddressSync(
//     [
//       Buffer.from("order"),
//       authority.publicKey.toBuffer(),
//       Buffer.from(cropName, "utf8"),
//     ],
//     PROGRAM_ID
//   );

//   // c) Encode instruction data via the IDL coder
//   const data = program.coder.instruction.encode("confirm_order", {
//     crop_name: cropName,
//     quantity:  qtyBN,
//     buyer:     buyerKey,
//   });

//   // d) Build account metas matching #[derive(Accounts)]
//   const keys = [
//     { pubkey: orderPda,            isSigner: false, isWritable: true  },
//     { pubkey: authority.publicKey, isSigner: true,  isWritable: true  },
//     { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
//   ];

//   // e) Create & send the TransactionInstruction
//   const ix = new TransactionInstruction({
//     programId: PROGRAM_ID,
//     keys,
//     data,
//   });
//   const tx = new Transaction().add(ix);
//   const sig = await provider.sendAndConfirm(tx, [authority]);
//   console.log("✅ On‐chain signature:", sig);
//   return sig;
// }

// module.exports = { logTransactionOnChain };
