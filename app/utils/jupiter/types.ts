import { PublicKey } from '@solana/web3.js';

export interface Token {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI?: string;
}

export interface QuoteResponse {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: SwapMode;
  slippageBps: number;
  platformFee: null | {
    amount: string;
    feeBps: number;
  };
  priceImpactPct: number;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
  contextSlot?: number;
  timeTaken?: number;
}

export interface SwapInstructions {
  computeBudgetInstructions: Instruction[];
  setupInstructions: Instruction[];
  swapInstruction: Instruction;
  cleanupInstruction: Instruction | null;
  addressLookupTableAddresses: string[];
}

export interface Instruction {
  programId: string;
  accounts: {
    pubkey: string;
    isSigner: boolean;
    isWritable: boolean;
  }[];
  data: string;
}

export interface SwapResult {
  inputToken: string;
  outputToken: string;
  inputAmount: number;
  outputAmount: number;
  txId: string;
  timestamp: string;
}

export type SwapMode = 'ExactIn' | 'ExactOut';

export interface SwapParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
  swapMode?: SwapMode;
  userPublicKey?: string;
}

export interface SwapTransaction {
  swapTransaction: string;
  lastValidBlockHeight: number;
  signers?: Array<{
    publicKey: PublicKey;
    secretKey: Uint8Array;
  }>;
} 