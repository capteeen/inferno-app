import axios from 'axios';
import { 
  QuoteResponse, 
  SwapInstructions,
  SwapParams,
  SwapTransaction,
  SwapMode
} from './types';

// Common token mints
const TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
} as const;

const JUPITER_API_URL = 'https://quote-api.jup.ag/v6';

async function getQuote({
  inputMint,
  outputMint,
  amount,
  slippageBps = 50,
  swapMode = 'ExactIn'
}: Omit<SwapParams, 'userPublicKey'>): Promise<QuoteResponse> {
  try {
    const response = await axios.get(`${JUPITER_API_URL}/quote`, {
      params: {
        inputMint,
        outputMint,
        amount: amount.toString(),
        slippageBps: Math.floor(slippageBps),
        swapMode,
        onlyDirectRoutes: false,
        asLegacyTransaction: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting quote:', error);
    throw error;
  }
}

async function getSwapInstructions(
  quoteResponse: QuoteResponse,
  userPublicKey: string
): Promise<SwapTransaction> {
  try {
    // Extract required fields from quoteResponse
    const {
      inputMint,
      outputMint,
      inAmount,
      outAmount,
      otherAmountThreshold,
      swapMode,
      slippageBps,
      platformFee,
      priceImpactPct,
      routePlan
    } = quoteResponse;

    const response = await axios.post(`${JUPITER_API_URL}/swap`, {
      // Only send the fields that the API expects
      quoteResponse: {
        inputMint,
        outputMint,
        inAmount,
        outAmount,
        otherAmountThreshold,
        swapMode,
        slippageBps,
        platformFee,
        priceImpactPct,
        routePlan
      },
      userPublicKey,
      wrapUnwrapSOL: true, // Add this to handle SOL wrapping/unwrapping
      asLegacyTransaction: true,
      useSharedAccounts: true, // Add this to reduce transaction size
      computeUnits: 600000
    });
    return response.data;
  } catch (error) {
    console.error('Error getting swap instructions:', error);
    throw error;
  }
}

export const jupiterClient = {
  TOKENS,
  getQuote,
  getSwapInstructions
}; 