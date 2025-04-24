'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TokenAnalysisCard from '../../components/TokenAnalysisCard';
import { formatNumber, formatPrice, formatPercentage } from '../../utils/format';

// Token data utilities
interface TokenData {
  name: string;
  symbol: string;
  contractAddress: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  network: string;
  riskLevel: string;
  holders?: number;
  totalSupply?: string;
  analysis?: string;
  volume24h?: number;
  volatility?: number;
  liquidity?: number;
  fdv?: number;
  price24h?: number;  // Add this field
  price24hUsdChange?: number;  // Add this field
  price24hPercentChange?: number;  // Add this field
  exchange?: string;
  socialMetrics?: {
    twitterFollowers: number;
    telegramMembers: number;
    discordMembers: number;
  };
  technicalAnalysis?: {
    volatility: number;
    trendStrength: number;
    supportLevel: number;
    resistanceLevel: number;
  };
  marketCapNote?: string;
}

// Request types for API categorization
enum RequestType {
  TOKEN_INFO = "TOKEN_INFO",
  WALLET_BALANCE = "WALLET_BALANCE",
  NEW_TOKENS = "NEW_TOKENS",
  HOLDERS = "HOLDERS",
  SWAPS = "SWAPS",
  PAIRS = "PAIRS",
  PRICE = "PRICE",
  TRENDING = "TRENDING",
  SEARCH = "SEARCH",
  GENERAL = "GENERAL"
}

// API configuration
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || "";
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

// Add types for message content
interface TextMessageContent {
  type: 'text';
  content: string;
}

interface TokenAnalysisContent {
  type: 'token_analysis';
  tokenData: TokenData;
  analysis: string;
}

type MessageContent = string | TextMessageContent | TokenAnalysisContent;

interface ChatMessage {
  role: 'user' | 'system';
  content: MessageContent;
}

// Add conversation context interface
interface ConversationContext {
  lastTokenData?: TokenData;
  lastTokenAddress?: string;
  messageHistory: { role: string; content: string }[];
}

export default function BlazeBot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content: 'Welcome to BlazeBot, your AI crypto assistant. How can I help you today?'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTimeoutId, setProcessingTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  // Add conversation context state
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    messageHistory: []
  });

  // Cleanup processing state and timeouts when component unmounts or when dependencies change
  useEffect(() => {
    return () => {
      // Clear any existing timeout when component unmounts
      if (processingTimeoutId) {
        clearTimeout(processingTimeoutId);
      }
      // Reset processing state
      setIsProcessing(false);
    };
  }, [processingTimeoutId]);

  // Helper function to add system messages to the chat
  const addSystemMessage = (message: string) => {
    setMessages(prev => [...prev, { 
      role: 'system', 
      content: {
        type: 'text',
        content: message
      }
    }]);
  };

  // Function to detect if message contains a potential token reference
  const detectTokenReference = (message: string) => {
    console.log('Detecting token references in message:', message);
    
    // Solana address pattern - matches base58 addresses
    const solAddressPattern = /[1-9A-HJ-NP-Za-km-z]{32,44}(?:pump)?/g;
    
    // Check for common token name patterns
    const tokenNamePattern = /\b(SOL|JUP|BONK|JTO|WIF|RNDR|PYTH|RAY|SAMO|MEME|DYM)\b/gi;
    
    // Extract matches while preserving case
    const solMatches = Array.from(message.matchAll(solAddressPattern)).map(match => {
      const addr = match[0];
      const startIndex = match.index;
      // Find the actual substring in the original message to preserve case
      const originalCase = startIndex !== undefined ? message.substr(startIndex, addr.length) : addr;
      console.log('Found Solana address:', addr);
      console.log('Original case preserved:', originalCase);
      return originalCase;
    });
    
    const tokenMatches = (message.match(tokenNamePattern) || []).map(token => token.toUpperCase());
    
    const result = {
      contractAddresses: solMatches,
      tokenNames: tokenMatches
    };
    
    console.log('Token detection result:', result);
    return result;
  };
  
  // Function to detect wallet addresses
  const detectWalletAddress = (message: string) => {
    // Solana address pattern
    const solAddressPattern = /[1-9A-HJ-NP-Za-km-z]{32,44}(?:pump)?/g;
    
    // Extract matches
    const solMatches = Array.from(message.matchAll(solAddressPattern)).map(match => match[0]);
    
    return solMatches;
  };

  // Detect the type of request from the user message
  const detectRequestType = (userMessage: string): { type: RequestType, params: any } => {
    const message = userMessage.toLowerCase();
    
    // Wallet balance request detection
    if (
      message.includes("balance") || 
      message.includes("portfolio") || 
      message.includes("holdings") || 
      message.includes("assets") ||
      (message.includes("wallet") && detectWalletAddress(message).length > 0)
    ) {
      const addresses = detectWalletAddress(message);
      if (addresses.length > 0) {
        return { 
          type: RequestType.WALLET_BALANCE, 
          params: { address: addresses[0], network: addresses[0].startsWith("0x") ? "eth" : "solana" } 
        };
      }
    }
    
    // New/trending tokens detection
    if (
      message.includes("new tokens") || 
      message.includes("new projects") || 
      message.includes("new listings") ||
      message.includes("recent launches") ||
      message.includes("just launched")
    ) {
      // Determine exchange if mentioned
      let exchange = "raydium";
      if (message.includes("jupiter")) exchange = "jupiter";
      if (message.includes("orca")) exchange = "orca";
      
      return { 
        type: RequestType.NEW_TOKENS, 
        params: { exchange } 
      };
    }
    
    // Trending tokens detection
    if (
      message.includes("trending") || 
      message.includes("popular") || 
      message.includes("hot tokens") ||
      message.includes("top tokens") ||
      message.includes("best performers")
    ) {
      return { 
        type: RequestType.TRENDING, 
        params: { chain: "solana", limit: 5 } 
      };
    }
    
    // Holders analysis detection
    if (
      message.includes("holders") || 
      message.includes("hodlers") || 
      message.includes("holder stats") ||
      message.includes("who holds")
    ) {
      const tokenRefs = detectTokenReference(message);
      if (tokenRefs.contractAddresses.length > 0) {
        return { 
          type: RequestType.HOLDERS, 
          params: { address: tokenRefs.contractAddresses[0] } 
        };
      } else if (tokenRefs.tokenNames.length > 0) {
        return { 
          type: RequestType.HOLDERS, 
          params: { token: tokenRefs.tokenNames[0] } 
        };
      }
    }
    
    // Swaps detection
    if (
      message.includes("swaps") || 
      message.includes("trades") || 
      message.includes("trading activity") ||
      message.includes("transactions")
    ) {
      const tokenRefs = detectTokenReference(message);
      const addresses = detectWalletAddress(message);
      
      if (addresses.length > 0 && !tokenRefs.contractAddresses.includes(addresses[0])) {
        return { 
          type: RequestType.SWAPS, 
          params: { walletAddress: addresses[0], network: addresses[0].startsWith("0x") ? "mainnet" : "mainnet" } 
        };
      } else if (tokenRefs.contractAddresses.length > 0) {
        return { 
          type: RequestType.SWAPS, 
          params: { tokenAddress: tokenRefs.contractAddresses[0], network: tokenRefs.contractAddresses[0].startsWith("0x") ? "mainnet" : "mainnet" } 
        };
      }
    }
    
    // Price detection
    if (
      message.includes("price") || 
      message.includes("value") || 
      message.includes("worth") ||
      message.includes("cost") ||
      message.includes("how much is")
    ) {
      const tokenRefs = detectTokenReference(message);
      if (tokenRefs.contractAddresses.length > 0) {
        return { 
          type: RequestType.PRICE, 
          params: { address: tokenRefs.contractAddresses[0], network: tokenRefs.contractAddresses[0].startsWith("0x") ? "eth" : "solana" } 
        };
      } else if (tokenRefs.tokenNames.length > 0) {
        return { 
          type: RequestType.PRICE, 
          params: { token: tokenRefs.tokenNames[0] } 
        };
      }
    }
    
    // Token search detection
    if (
      message.includes("search for") || 
      message.includes("find token") || 
      message.includes("lookup")
    ) {
      // Extract the token name to search for
      let searchQuery = "";
      const searchMatch = message.match(/(search for|find token|lookup)\s+([a-z0-9 ]+)/i);
      if (searchMatch && searchMatch[2]) {
        searchQuery = searchMatch[2].trim();
      } else {
        // Try to find any word that might be a token name
        const words = message.split(/\s+/);
        for (const word of words) {
          if (word.length > 2 && !["for", "the", "token", "search", "find", "lookup", "about"].includes(word.toLowerCase())) {
            searchQuery = word;
            break;
          }
        }
      }
      
      if (searchQuery) {
        return { 
          type: RequestType.SEARCH, 
          params: { query: searchQuery, chain: "solana" } 
        };
      }
    }
    
    // Default to token info if we can detect a token reference
    const tokenRefs = detectTokenReference(message);
    if (tokenRefs.contractAddresses.length > 0 || tokenRefs.tokenNames.length > 0) {
      const reference = tokenRefs.contractAddresses.length > 0 
        ? tokenRefs.contractAddresses[0] 
        : tokenRefs.tokenNames[0];
      
      const isAddress = tokenRefs.contractAddresses.length > 0;
      
      return { 
        type: RequestType.TOKEN_INFO, 
        params: { reference, isAddress } 
      };
    }
    
    // If no specific request type detected, default to general
    return { type: RequestType.GENERAL, params: { query: message } };
  };

  // Helper function to process token data from API response
  const processTokenData = (data: any, address: string, network: string): TokenData => {
    // Calculate market cap from total supply and price
    const marketCap = data.totalSupplyFormatted && data.usdPrice 
      ? parseFloat(data.totalSupplyFormatted) * data.usdPrice
      : data.fullyDilutedValue 
        ? parseFloat(data.fullyDilutedValue)
        : 0;

    // Calculate risk level based on various factors
    const riskLevel = calculateRiskLevel({
      priceChange24h: data.usdPrice24hrPercentChange,
      totalVolume: parseFloat(data.fullyDilutedValue || '0')
    });

    return {
      name: data.name || 'Unknown Token',
      symbol: data.symbol || 'UNKNOWN',
      contractAddress: address,
      price: data.usdPrice || 0,
      priceChange24h: data.usdPrice24hrPercentChange || 0,
      marketCap: marketCap,
      network: network,
      riskLevel: riskLevel,
      volume24h: parseFloat(data.fullyDilutedValue || '0'),
      holders: 0, // Not available in current data
      liquidity: parseFloat(data.fullyDilutedValue || '0'),
      fdv: parseFloat(data.fullyDilutedValue || '0'),
      totalSupply: data.totalSupplyFormatted,
      socialMetrics: {
        twitterFollowers: 0,
        telegramMembers: 0,
        discordMembers: 0
      },
      technicalAnalysis: {
        volatility: Math.abs(data.usdPrice24hrPercentChange || 0),
        trendStrength: (data.usdPrice24hrPercentChange || 0) > 0 ? 1 : -1,
        supportLevel: data.usdPrice24h || 0,
        resistanceLevel: data.usdPrice || 0
      }
    };
  };

  const calculateRiskLevel = (data: any): string => {
    // Simple risk calculation based on price change and volume
    const priceChange = Math.abs(data.priceChange24h || 0);
    const volume = data.totalVolume || 0;
    
    if (priceChange > 50 || volume < 1000) return 'High';
    if (priceChange > 20 || volume < 10000) return 'Medium';
    return 'Low';
  };

  // Function to fetch token data from Moralis API
  const fetchTokenData = async (address: string, network: string): Promise<TokenData> => {
    try {
      // Validate and format the Solana address
      const tokenAddress = address.trim();
      
      // Log the address being used
      console.log('Raw token address:', address);
      console.log('Processed token address:', tokenAddress);
      console.log('Using network:', network);
      console.log('API Key present:', !!MORALIS_API_KEY);

      // Validate the address format with updated pattern
      if (!tokenAddress.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}(?:pump)?$/)) {
        console.error('Invalid Solana token address format');
        throw new Error('Invalid token address format');
      }

      // Try fetching token metadata first
      let metadata;
      try {
        const metadataUrl = `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/metadata`;
        console.log('Fetching metadata from:', metadataUrl);
        
        const metadataResponse = await fetch(metadataUrl, {
          headers: {
            'accept': 'application/json',
            'X-API-Key': MORALIS_API_KEY
          }
        });

        console.log('Metadata response status:', metadataResponse.status);
        const responseText = await metadataResponse.text();
        console.log('Metadata response text:', responseText);

        if (!metadataResponse.ok) {
          console.warn(`Metadata fetch failed with status ${metadataResponse.status}`);
          throw new Error(`Metadata fetch failed: ${metadataResponse.statusText}`);
        }
        
        metadata = JSON.parse(responseText);
        console.log('Parsed metadata:', metadata);
      } catch (metadataError) {
        console.warn('Error fetching metadata:', metadataError);
        metadata = {
          name: 'Unknown Token',
          symbol: 'UNKNOWN',
          decimals: 9
        };
      }

      // Try fetching price data
      let priceData;
      try {
        const priceUrl = `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/price`;
        console.log('Fetching price data from:', priceUrl);
        
        const priceResponse = await fetch(priceUrl, {
          headers: {
            'accept': 'application/json',
            'X-API-Key': MORALIS_API_KEY
          }
        });

        console.log('Price response status:', priceResponse.status);
        const responseText = await priceResponse.text();
        console.log('Price response text:', responseText);

        if (!priceResponse.ok) {
          console.warn(`Price fetch failed with status ${priceResponse.status}`);
          throw new Error(`Price fetch failed: ${priceResponse.statusText}`);
        }
        
        priceData = JSON.parse(responseText);
        console.log('Parsed price data:', priceData);
        
        // Calculate 24h price data
        const price = parseFloat(priceData.usdPrice || '0');
        const priceChange24h = parseFloat(priceData.usdPrice24hrPercentChange || '0');
        const price24h = price / (1 + (priceChange24h / 100));
        const price24hUsdChange = price - price24h;
        
        priceData = {
          ...priceData,
          price24h,
          price24hUsdChange,
          price24hPercentChange: priceChange24h
        };
      } catch (priceError) {
        console.warn('Error fetching price:', priceError);
        priceData = {
          price: 0,
          priceChange24h: 0,
          volume24h: 0,
          marketCap: 0,
          price24h: 0,
          price24hUsdChange: 0,
          price24hPercentChange: 0
        };
      }

      // Combine metadata and price data
      const combinedData = {
        ...metadata,
        ...priceData,
        contractAddress: tokenAddress
      };

      console.log('Combined token data:', combinedData);

      // Return processed token data
      const processedData = {
        name: combinedData.name || 'Unknown Token',
        symbol: combinedData.symbol || 'UNKNOWN',
        contractAddress: tokenAddress,
        price: parseFloat(combinedData.usdPrice || '0'),
        priceChange24h: parseFloat(combinedData.usdPrice24hrPercentChange || '0'),
        marketCap: parseFloat(combinedData.marketCap || '0'),
        network: network,
        riskLevel: calculateRiskLevel({
          priceChange24h: parseFloat(combinedData.usdPrice24hrPercentChange || '0'),
          totalVolume: parseFloat(combinedData.volume24h || '0')
        }),
        volume24h: parseFloat(combinedData.volume24h || '0'),
        liquidity: parseFloat(combinedData.liquidity || '0'),
        fdv: parseFloat(combinedData.fullyDilutedValue || '0'),
        totalSupply: combinedData.totalSupplyFormatted,
        price24h: combinedData.price24h || 0,
        price24hUsdChange: combinedData.price24hUsdChange || 0,
        price24hPercentChange: combinedData.price24hPercentChange || 0,
        exchange: combinedData.exchange || 'Unknown Exchange',
        socialMetrics: {
          twitterFollowers: 0,
          telegramMembers: 0,
          discordMembers: 0
        }
      };

      console.log('Processed token data:', processedData);
      return processedData;
    } catch (error) {
      console.error('Error in fetchTokenData:', error);
      throw error;
    }
  };
  
  // Function to generate mock data for testing/demo purposes
  const generateMockDataForToken = (tokenSymbol: string): TokenData => {
    console.log(`Generating mock data for token: ${tokenSymbol}`);
    
    // Map of some known tokens with realistic mock data
    const knownTokenMocks: Record<string, TokenData> = {
      "SOL": {
        name: "Solana",
        symbol: "SOL",
        contractAddress: "So11111111111111111111111111111111111111112",
        price: 73.25,
        priceChange24h: 2.3,
        marketCap: 32950000000,
        network: "Solana",
        riskLevel: "Low"
      },
      "JUP": {
        name: "Jupiter",
        symbol: "JUP",
        contractAddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
        price: 0.82,
        priceChange24h: -1.5,
        marketCap: 1150000000,
        network: "Solana",
        riskLevel: "Medium"
      },
      "BONK": {
        name: "Bonk",
        symbol: "BONK",
        contractAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        price: 0.00002145,
        priceChange24h: 3.8,
        marketCap: 1350000000,
        network: "Solana",
        riskLevel: "High"
      }
    };
    
    // Check if we have mock data for this token
    const upperSymbol = tokenSymbol.toUpperCase();
    if (knownTokenMocks[upperSymbol]) {
      return knownTokenMocks[upperSymbol];
    }
    
    // Generate random but realistic data for unknown tokens
    const randomPrice = Math.random() * 10;
    const randomChange = (Math.random() * 20) - 10; // -10% to +10%
    const randomMarketCap = Math.random() * 1000000000;
    
    return {
      name: tokenSymbol,
      symbol: tokenSymbol,
      contractAddress: "Unknown",
      price: randomPrice,
      priceChange24h: randomChange,
      marketCap: randomMarketCap,
      network: "Solana",
      riskLevel: "Unknown"
    };
  };

  // Function to analyze token data with OpenAI
  const analyzeTokenWithAI = async (tokenData: TokenData, userQuery: string) => {
    try {
      // Use OpenAI API to analyze the token data
      if (!OPENAI_API_KEY) {
        console.warn("OpenAI API key is missing, using local analysis instead");
        return { 
          tokenData,
          analysis: generateLocalAnalysis(tokenData)
        };
      }
      
      // Format token data with validation to ensure we're not sending undefined values
      const formatValue = (value: any, defaultVal: string = "Unknown") => 
        value !== undefined && value !== null ? value : defaultVal;
      
      const priceFormatted = tokenData.price 
        ? `$${tokenData.price < 0.01 ? tokenData.price.toFixed(8) : tokenData.price.toFixed(2)}`
        : "Unknown";
        
      const priceChangeFormatted = tokenData.priceChange24h !== undefined
        ? `${tokenData.priceChange24h > 0 ? "+" : ""}${tokenData.priceChange24h.toFixed(2)}%`
        : "Unknown";
        
      const marketCapFormatted = tokenData.marketCap 
        ? `$${(tokenData.marketCap / 1000000000).toFixed(2)}B` 
        : "Unknown";
      
      const holdersFormatted = tokenData.holders
        ? tokenData.holders.toLocaleString()
        : "Unknown";
      
      // Build detailed token information with available data
      const tokenInfo = `
        Token Information:
        -------------------
        Name: ${formatValue(tokenData.name)}
        Symbol: ${formatValue(tokenData.symbol)}
        Network: ${formatValue(tokenData.network)}
        Contract Address: ${formatValue(tokenData.contractAddress)}
        
        Price Data:
        -------------------
        Current Price: ${priceFormatted}
        24h Price Change: ${priceChangeFormatted}
        Market Cap: ${marketCapFormatted}
        
        Supply & Holders:
        -------------------
        Total Supply: ${formatValue(tokenData.totalSupply)}
        Holders: ${holdersFormatted}
        
        Risk Assessment:
        -------------------
        Risk Level: ${formatValue(tokenData.riskLevel)}
        ${tokenData.analysis ? `Analysis: ${tokenData.analysis}` : ''}
      `;
      
      // Enhanced system prompt to ensure token data is processed properly
      const systemPrompt = `
        You are a cryptocurrency analysis expert. Your task is to provide accurate, informative analysis of token data.
        
        IMPORTANT INSTRUCTIONS:
        1. Always begin your response with "Here is token analysis:" 
        2. Always use ONLY the specific token data provided. Do not make assumptions about the token.
        3. If the token name and symbol are provided, use them exactly as given.
        4. Focus on price trends, market cap, and risk assessment if available.
        5. If data values are "Unknown", acknowledge this but avoid speculation.
        6. Format amounts clearly (e.g., use $ for USD values, % for percentages).
        7. Keep your response conversational but concise (150-200 words maximum).
        8. The user query is provided for context, but prioritize explaining the token data accurately.
        
        Now provide an analysis based ONLY on the data below:
      `;
      
      // Add a timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: systemPrompt
              },
              {
                role: "user",
                content: `
                  User question: ${userQuery}
                  
                  ${tokenInfo}
                  
                  Provide a clear, accurate analysis of this token based solely on the data above.
                `
              }
            ],
            temperature: 0.5,  // Lower temperature for more consistent results
            max_tokens: 300
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        // Convert the response to string to fix type error
        return { 
          tokenData,
          analysis: data.choices[0].message.content?.toString() || generateLocalAnalysis(tokenData)
        };
      } catch (fetchError) {
        console.error("OpenAI API fetch error:", fetchError);
        // If the API fails, use the local analysis
        return { 
          tokenData,
          analysis: generateLocalAnalysis(tokenData)
        };
      } finally {
        clearTimeout(timeoutId);
      }
      
    } catch (error) {
      console.error("Error analyzing token with AI:", error);
      return { 
        tokenData,
        analysis: generateLocalAnalysis(tokenData)
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Function to generate a local analysis if OpenAI API fails
  const generateLocalAnalysis = (tokenData: TokenData): string => {
    const priceDirection = tokenData.priceChange24h && tokenData.priceChange24h > 0 ? "up" : "down";
    const priceChangeAbs = tokenData.priceChange24h ? Math.abs(tokenData.priceChange24h) : 0;
    
    const marketCapFormatted = tokenData.marketCap 
      ? `$${(tokenData.marketCap / 1000000000).toFixed(2)}B` 
      : "Unknown";
    
    let analysis = `Here is token analysis: ${tokenData.name} (${tokenData.symbol}) is currently trading at $${tokenData.price?.toFixed(tokenData.price < 0.01 ? 8 : 2)} with ${priceDirection === "up" ? "+" : "-"}${priceChangeAbs.toFixed(1)}% in the last 24h. Market cap: ${marketCapFormatted}.`;
    
    if (tokenData.network) {
      analysis += ` Network: ${tokenData.network}.`;
    }
    
    if (tokenData.riskLevel) {
      const riskDetails = {
        "Low": "This token has good liquidity, established history, and minimal contract risks.",
        "Medium": "This token has moderate liquidity and some potential volatility concerns.",
        "High": "This token has high volatility, limited liquidity, or potential contract risks.",
        "Unknown": "Insufficient data to assess risk level accurately."
      };
      
      analysis += ` Risk assessment: ${tokenData.riskLevel}. ${riskDetails[tokenData.riskLevel as keyof typeof riskDetails]}`;
    }
    
    // Add liquidity analysis
    if (typeof tokenData.liquidity === 'number' && tokenData.liquidity > 0) {
      if (tokenData.liquidity > 1000000) {
        analysis += ` The token has strong liquidity of $${formatNumber(tokenData.liquidity)}. `;
      } else if (tokenData.liquidity > 100000) {
        analysis += ` The token has moderate liquidity of $${formatNumber(tokenData.liquidity)}. `;
      } else {
        analysis += ` The token has limited liquidity of $${formatNumber(tokenData.liquidity)}. `;
      }
    }
    
    return analysis;
  };

  // Token analysis card component
  const TokenAnalysisCard = ({ tokenData, analysis }: { tokenData: TokenData, analysis: string }) => {
    // Check if we seem to have valid data
    const hasValidData = tokenData.name !== "Unknown" && tokenData.symbol !== "???" && tokenData.price !== 0;

    // Check if API key might be missing
    const isMissingApiKey = !MORALIS_API_KEY || MORALIS_API_KEY === "";

    // Determine price change color
    const getPriceChangeColor = (change: number | undefined) => 
      change === undefined ? "text-white/70" :
      change > 0 ? "text-green-400" : 
      change < 0 ? "text-red-400" : 
      "text-white/70";

    // Function to get token logo URL based on symbol
    const getTokenLogoUrl = (symbol: string, network: string) => {
      const defaultLogo = "/default-token.svg";
      if (!symbol) return defaultLogo;
      
      // For common tokens, return logo URL
      const knownTokens: Record<string, string> = {
        "SOL": "https://assets.solana.fm/token/icon/png/sol.png",
        "JUP": "https://assets.solana.fm/token/icon/png/jup.png",
        "BONK": "https://assets.solana.fm/token/icon/png/bonk.png",
        "JTO": "https://assets.solana.fm/token/icon/png/jto.png",
        "WIF": "https://assets.solana.fm/token/icon/png/wif.png",
        "PYTH": "https://assets.solana.fm/token/icon/png/pyth.png",
        "SAMO": "https://assets.solana.fm/token/icon/png/samo.png"
      };
      
      return knownTokens[symbol] || `/placeholder-token.svg`;
    };

    // Error states handling (keep existing error handling)
    if (isMissingApiKey) {
      return (
        <div className="rounded-xl overflow-hidden backdrop-blur-md border border-red-500/30 shadow-2xl bg-black/40">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-400">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg text-red-400">API Key Missing</h3>
            </div>
            <p className="text-sm mb-4">
              Moralis API key is not configured. To get token data, you need to:
            </p>
            <ol className="text-sm space-y-2 list-decimal pl-5 mb-4">
              <li>Sign up for a free account at <a href="https://moralis.io" target="_blank" rel="noopener noreferrer" className="text-primary underline">Moralis.io</a></li>
              <li>Create an API key in your dashboard</li>
              <li>Add the API key to your .env.local file as NEXT_PUBLIC_MORALIS_API_KEY</li>
            </ol>
            <p className="text-sm text-white/70">
              Until then, this demo will display mock data.
            </p>
          </div>
        </div>
      );
    }

    if (!hasValidData) {
      return (
        <div className="rounded-xl overflow-hidden backdrop-blur-md border border-amber-500/30 shadow-2xl bg-black/40">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-400">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg text-amber-400">Data Retrieval Error</h3>
            </div>
            <p className="text-sm mb-4">
              Unable to fetch token data from Moralis API. This could be due to:
            </p>
            <ul className="text-sm space-y-2 list-disc pl-5 mb-4">
              <li>Invalid token address</li>
              <li>Network connection issues</li>
              <li>Token not indexed by Moralis</li>
              <li>API rate limits exceeded</li>
            </ul>
            <p className="text-sm text-white/70">
              Check the browser console for detailed error messages.
            </p>
          </div>
        </div>
      );
    }

    // Mini sparkline data (mock data - in production this would come from real price data)
    const sparklineData = [20, 26, 22, 28, 24, 30, 28, 35, 32, 38, 34, 40, 38, 44];

    return (
      <div className="rounded-xl overflow-hidden backdrop-blur-md border border-white/10 shadow-2xl bg-black/40">
        {/* Header with Token Info */}
        <div className="bg-gradient-to-r from-black/40 to-black/60 p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                <Image 
                  src={getTokenLogoUrl(tokenData.symbol || "", tokenData.network || "")}
                  alt={tokenData.symbol || "Token"}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-xl">
                  {tokenData.name || "Unknown Token"}
                  <span className="ml-2 text-sm text-white/60">({tokenData.symbol})</span>
                </h3>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span>{tokenData.network || "Unknown Network"}</span>
                  <span>•</span>
                  <span>{tokenData.exchange || "Unknown Exchange"}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-mono">
                ${tokenData.price !== undefined ? 
                  (tokenData.price < 0.01 ? tokenData.price.toFixed(8) : tokenData.price.toFixed(2)) : 
                  "Unknown"}
              </div>
              <div className={`flex items-center gap-1 justify-end ${getPriceChangeColor(tokenData.priceChange24h)}`}>
                <span className="text-sm font-medium">
                  {tokenData.priceChange24h !== undefined && (
                    `${tokenData.priceChange24h > 0 ? "+" : ""}${tokenData.priceChange24h.toFixed(2)}%`
                  )}
                </span>
                <span className="text-xs text-white/60">(24h)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="p-4 border-b border-white/10 bg-black/20">
          <div className="h-16 flex items-end gap-0.5">
            {sparklineData.map((height, i) => (
              <div 
                key={i} 
                className={`w-full ${tokenData.priceChange24h >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-sm`}
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="p-4 grid grid-cols-2 gap-4">
          {/* Market Stats */}
          <div className="space-y-4">
            <div className="glass rounded-lg p-3 bg-white/5">
              <div className="text-sm text-white/60 mb-1">Market Cap (FDV)</div>
              <div className="font-mono text-lg font-bold">
                ${tokenData.fdv ? 
                  formatNumber(tokenData.fdv) : 
                  "Unknown"}
              </div>
            </div>
            
            <div className="glass rounded-lg p-3 bg-white/5">
              <div className="text-sm text-white/60 mb-1">Total Supply</div>
              <div className="font-mono text-lg font-bold">
                {tokenData.totalSupply ? 
                  formatNumber(parseFloat(tokenData.totalSupply)) : 
                  "Unknown"}
              </div>
            </div>
          </div>

          {/* Price Stats */}
          <div className="space-y-4">
            <div className="glass rounded-lg p-3 bg-white/5">
              <div className="text-sm text-white/60 mb-1">24h USD Change</div>
              <div className={`font-mono text-lg font-bold ${getPriceChangeColor(tokenData.price24hUsdChange)}`}>
                ${tokenData.price24hUsdChange ? 
                  formatNumber(tokenData.price24hUsdChange) : 
                  formatNumber(tokenData.price - (tokenData.price24h || tokenData.price))}
              </div>
            </div>

            <div className="glass rounded-lg p-3 bg-white/5">
              <div className="text-sm text-white/60 mb-1">24h Price</div>
              <div className="font-mono text-lg font-bold">
                ${tokenData.price24h ? 
                  formatNumber(tokenData.price24h) : 
                  formatNumber(tokenData.price)}
              </div>
            </div>
          </div>
        </div>

        {/* Links and Social */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between">
            {/* Contract Info */}
            <div className="flex items-center gap-4">
              <a 
                href={`https://solscan.io/token/${tokenData.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                View on Solscan
              </a>
              <span className="text-xs text-white/40">
                {tokenData.contractAddress ? 
                  `${tokenData.contractAddress.substring(0, 4)}...${tokenData.contractAddress.substring(tokenData.contractAddress.length - 4)}` : 
                  "Unknown Address"}
              </span>
            </div>

            {/* Social Links */}
            {tokenData.socialMetrics && (
              <div className="flex items-center gap-3">
                {tokenData.socialMetrics.twitterFollowers > 0 && (
                  <a 
                    href={`https://twitter.com/search?q=${tokenData.symbol}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-primary transition-colors"
                    title={`${tokenData.socialMetrics.twitterFollowers.toLocaleString()} followers`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                    </svg>
                  </a>
                )}
                {tokenData.socialMetrics.telegramMembers > 0 && (
                  <a 
                    href={`https://t.me/s/${tokenData.symbol.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-primary transition-colors"
                    title={`${tokenData.socialMetrics.telegramMembers.toLocaleString()} members`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701l-.321 4.843c.47 0 .677-.216.94-.477l2.26-2.196l4.696 3.466c.866.48 1.488.233 1.704-.803l3.082-14.503c.315-1.263-.462-1.838-1.538-1.297z"/>
                    </svg>
                  </a>
                )}
                <a 
                  href={`https://moralis.io/token/${tokenData.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-primary transition-colors"
                  title="View on Moralis"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.84 6.72 2.25M21 3v6h-6"/>
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Helper function to generate a basic response when AI fails
  const generateBasicResponse = (query: string, tokenData: TokenData): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('price')) {
      return `${tokenData.name} (${tokenData.symbol}) is currently trading at ${formatPrice(tokenData.price)}`;
    }
    if (lowerQuery.includes('market cap')) {
      return `${tokenData.name}'s market cap is ${formatNumber(tokenData.marketCap)}`;
    }
    if (lowerQuery.includes('volume')) {
      return `${tokenData.name}'s 24h volume is ${formatNumber(tokenData.volume24h || 0)}`;
    }
    
    return `${tokenData.name} (${tokenData.symbol}) - Price: ${formatPrice(tokenData.price)}, 24h Change: ${formatPercentage(tokenData.priceChange24h)}`;
  };

  // Process incoming messages and generate responses
  const processMessage = async (text: string) => {
    try {
      console.log('Processing message:', text);
      setIsProcessing(true);
      
      if (processingTimeoutId) {
        clearTimeout(processingTimeoutId);
      }
      
      setMessages(prev => [...prev, { 
        role: 'user', 
        content: { type: 'text', content: text }
      }]);

      // Update conversation history
      const updatedHistory = [
        ...conversationContext.messageHistory,
        { role: "user", content: text }
      ].slice(-10); // Keep last 10 messages for context

      // First, try to detect a Solana token address
      const solanaAddressMatch = text.match(/[1-9A-HJ-NP-Za-km-z]{32,44}(?:pump)?/);
      
      if (solanaAddressMatch) {
        const tokenAddress = solanaAddressMatch[0];
        console.log('Detected Solana token address:', tokenAddress);
        
        addSystemMessage("Analyzing token data...");
        
        try {
          const tokenData = await fetchTokenData(tokenAddress, "solana");
          
          if (tokenData) {
            console.log('Successfully fetched token data:', tokenData);
            
            // Update conversation context with new token data
            setConversationContext(prev => ({
              ...prev,
              lastTokenData: tokenData,
              lastTokenAddress: tokenAddress,
              messageHistory: updatedHistory
            }));

            // Format token data for OpenAI
            const formattedData = {
              name: tokenData.name,
              symbol: tokenData.symbol,
              price: formatPrice(tokenData.price),
              priceChange24h: formatPercentage(tokenData.priceChange24h),
              marketCap: formatNumber(tokenData.marketCap),
              volume24h: formatNumber(tokenData.volume24h || 0),
              liquidity: formatNumber(tokenData.liquidity || 0),
              fdv: formatNumber(tokenData.fdv || 0),
              totalSupply: tokenData.totalSupply,
              network: tokenData.network,
              exchange: tokenData.exchange || 'Unknown',
              contractAddress: tokenData.contractAddress
            };

            await sendToOpenAI(text, formattedData, updatedHistory);
          }
        } catch (error) {
          console.error('Error fetching token data:', error);
          addSystemMessage(`I encountered an error while fetching data for this token address. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        return;
      }

      // Handle token symbol queries
      const tokenMatch = text.match(/\b(SOL|JUP|BONK|JTO|WIF|RNDR|PYTH|RAY|SAMO|MEME|DYM)\b/i);
      if (tokenMatch) {
        const symbol = tokenMatch[0].toUpperCase();
        const solanaTokenAddresses: Record<string, string> = {
          "SOL": "So11111111111111111111111111111111111111112",
          "JUP": "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
          "BONK": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
          "JTO": "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
          "WIF": "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
          "RAY": "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
          "PYTH": "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
          "SAMO": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
        };

        if (solanaTokenAddresses[symbol]) {
          return processMessage(solanaTokenAddresses[symbol]);
        }
      }

      // If no token reference found, check if we have recent token data
      if (conversationContext.lastTokenData) {
        // Format the last token data
        const formattedData = {
          name: conversationContext.lastTokenData.name,
          symbol: conversationContext.lastTokenData.symbol,
          price: formatPrice(conversationContext.lastTokenData.price),
          priceChange24h: formatPercentage(conversationContext.lastTokenData.priceChange24h),
          marketCap: formatNumber(conversationContext.lastTokenData.marketCap),
          volume24h: formatNumber(conversationContext.lastTokenData.volume24h || 0),
          liquidity: formatNumber(conversationContext.lastTokenData.liquidity || 0),
          fdv: formatNumber(conversationContext.lastTokenData.fdv || 0),
          totalSupply: conversationContext.lastTokenData.totalSupply,
          network: conversationContext.lastTokenData.network,
          exchange: conversationContext.lastTokenData.exchange || 'Unknown',
          contractAddress: conversationContext.lastTokenData.contractAddress
        };

        await sendToOpenAI(text, formattedData, updatedHistory);
      } else {
        // No token context, handle as general query
        await sendToOpenAI(text, null, updatedHistory);
      }

    } catch (err) {
      console.error('Error in processMessage:', err);
      addSystemMessage("I encountered an error processing your request. Please try again.");
    } finally {
      setIsProcessing(false);
      if (processingTimeoutId) {
        clearTimeout(processingTimeoutId);
      }
    }
  };

  // Helper function to send messages to OpenAI
  const sendToOpenAI = async (
    userMessage: string,
    tokenData: any | null,
    messageHistory: { role: string; content: string }[]
  ) => {
    try {
      const systemPrompt = tokenData 
        ? `You are a crypto analysis assistant. Answer the user's question using the provided token data and conversation history.
           IMPORTANT: In the provided Moralis data, the FDV (Fully Diluted Value) field represents the token's market cap.
           When users ask about market cap, use the FDV value from the data.
           If the question cannot be answered with the available data, say so.
           Format numbers clearly and use proper units.
           Keep responses concise and focused.
           Available token data: ${JSON.stringify(tokenData, null, 2)}`
        : `You are a helpful crypto assistant specializing in the Solana ecosystem.
           IMPORTANT NOTE: When discussing token metrics, the Fully Diluted Value (FDV) represents a token's market cap in our data.
           Help users with their crypto-related questions, but be clear when you need specific token information.
           If the user asks about a specific token but doesn't provide an address, ask them for the token address.
           Keep responses concise and informative.`;

      // Format token data to explicitly show market cap
      if (tokenData) {
        tokenData = {
          ...tokenData,
          marketCap: tokenData.fdv, // Ensure market cap is always set to FDV
          marketCapNote: "Market cap value is derived from Fully Diluted Value (FDV)"
        };
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...messageHistory,
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.status}`);
      }

      const aiResponse = await response.json();
      const aiMessage = aiResponse.choices[0].message.content.toString();

      // Update conversation history with AI's response
      setConversationContext(prev => ({
        ...prev,
        messageHistory: [...messageHistory, { role: "assistant", content: aiMessage }]
      }));

      setMessages(prev => [...prev, {
        role: 'system',
        content: {
          type: 'text',
          content: aiMessage
        }
      }]);
    } catch (aiError) {
      console.error('OpenAI API Error:', aiError);
      if (tokenData) {
        // Fallback to basic response if we have token data
        setMessages(prev => [...prev, {
          role: 'system',
          content: {
            type: 'text',
            content: generateBasicResponse(userMessage, conversationContext.lastTokenData!)
          }
        }]);
      } else {
        addSystemMessage("I'm having trouble processing your request. Please try again or provide a specific token address.");
      }
    }
  };

  // Handle message submission with debounce
  const handleSubmit = async () => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    
    // Prevent rapid submissions (must wait at least 500ms between submissions)
    if (timeSinceLastSubmit < 500) {
      console.log("Submission throttled, please wait");
      return;
    }
    
    if (message.trim() && !isProcessing) {
      try {
        setLastSubmitTime(now);
        const currentMessage = message;
        setMessage(''); // Clear input immediately for better UX
        await processMessage(currentMessage.trim());
      } catch (error) {
        console.error("Error submitting message:", error);
        // Ensure we handle errors gracefully
        addSystemMessage("I encountered an error processing your request. Please try again.");
        // Reset processing state
        setIsProcessing(false);
        // Clear timeout if it exists
        if (processingTimeoutId) {
          clearTimeout(processingTimeoutId);
          setProcessingTimeoutId(null);
        }
      }
    }
  };

  // Function to process Solana analytics data from the Moralis endpoint
  const processSolanaAnalyticsData = (data: any, address: string, network: string): TokenData => {
    try {
      console.log('Processing analytics data:', data);

      // Extract 24h metrics
      const totalBuyVolume = data.totalBuyVolume?.['24h'] || 0;
      const totalSellVolume = data.totalSellVolume?.['24h'] || 0;
      const totalBuyers = data.totalBuyers?.['24h'] || 0;
      const totalSellers = data.totalSellers?.['24h'] || 0;
      const totalBuys = data.totalBuys?.['24h'] || 0;
      const totalSells = data.totalSells?.['24h'] || 0;
      
      // Calculate derived metrics
      const volume24h = (totalBuyVolume + totalSellVolume) / 2;
      const priceChange24h = totalSellVolume > 0 
        ? ((totalBuyVolume - totalSellVolume) / totalSellVolume) * 100 
        : 0;
      
      // Calculate risk level based on various factors
      const liquidity = parseFloat(data.totalLiquidityUsd) || 0;
      const fdv = parseFloat(data.totalFullyDilutedValuation) || 0;
      const holders = totalBuyers + totalSellers;
      
      let riskLevel = 'High';
      if (liquidity > 1000000 && totalBuyers > totalSellers && fdv / liquidity < 10) {
        riskLevel = 'Low';
      } else if (liquidity > 100000 && totalBuyers > 0 && fdv / liquidity < 50) {
        riskLevel = 'Medium';
      }

      const tokenData: TokenData = {
        name: 'Unknown Token',
        symbol: 'UNKNOWN',
        contractAddress: address,
        price: 0,
        priceChange24h: priceChange24h,
        marketCap: fdv,
        network: network,
        riskLevel: riskLevel,
        volume24h: volume24h,
        holders: holders,
        liquidity: liquidity,
        fdv: fdv,
        socialMetrics: {
          twitterFollowers: 0,
          telegramMembers: 0,
          discordMembers: 0
        },
        technicalAnalysis: {
          volatility: Math.abs(priceChange24h),
          trendStrength: totalBuyers > totalSellers ? 1 : -1,
          supportLevel: 0,
          resistanceLevel: 0
        }
      };

      console.log('Processed token data:', tokenData);
      return tokenData;
    } catch (error) {
      console.error('Error processing analytics data:', error);
      throw error;
    }
  };

  // Function to fetch wallet balance from Moralis API
  const fetchWalletBalance = async (address: string, network: string): Promise<any> => {
    setIsProcessing(true);
    
    try {
      let result: any = {};
      
      if (network === "solana") {
        // Get native balance
        const nativeBalanceResponse = await fetch(`https://solana-gateway.moralis.io/account/mainnet/${address}/balance`, {
          headers: {
            "Accept": "application/json",
            "X-API-Key": MORALIS_API_KEY
          }
        });
        
        if (nativeBalanceResponse.ok) {
          const nativeBalance = await nativeBalanceResponse.json();
          result.nativeBalance = nativeBalance;
        }
        
        // Get token balances
        const tokenBalancesResponse = await fetch(`https://solana-gateway.moralis.io/account/mainnet/${address}/tokens`, {
          headers: {
            "Accept": "application/json",
            "X-API-Key": MORALIS_API_KEY
          }
        });
        
        if (tokenBalancesResponse.ok) {
          const tokenBalances = await tokenBalancesResponse.json();
          result.tokens = tokenBalances;
        }
        
        // Get portfolio data
        const portfolioResponse = await fetch(`https://solana-gateway.moralis.io/account/mainnet/${address}/portfolio`, {
          headers: {
            "Accept": "application/json",
            "X-API-Key": MORALIS_API_KEY
          }
        });
        
        if (portfolioResponse.ok) {
          const portfolio = await portfolioResponse.json();
          result.portfolio = portfolio;
        }
      } else {
        // Ethereum balance - fallback to mock data for this example
        result = {
          nativeBalance: {
            solana: "10.5",
            usd: 1642.35
          },
          tokens: [
            {
              associatedTokenAddress: "ATxhBRNuPpQsRm9L9hFrEF9NPAVp3gxPjPaQQKaGDtKQ",
              mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              amount: "125.75",
              amountRaw: "125750000",
              decimals: 6,
              name: "USD Coin",
              symbol: "USDC"
            },
            {
              associatedTokenAddress: "BZCPpva12M9SqJgcpf6ZXoZ7GqKUGPPMLK5TuJZzATzV",
              mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
              amount: "5731429.23",
              amountRaw: "5731429234567",
              decimals: 5,
              name: "Bonk",
              symbol: "BONK"
            }
          ],
          portfolio: {
            total: {
              solana: "10.5",
              usd: 1893.72
            },
            positions: [
              {
                token: {
                  address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  name: "USD Coin",
                  symbol: "USDC",
                  logo: "https://assets.solana.fm/token/icon/png/usdc.png"
                },
                quantity: "125.75",
                value: {
                  solana: "0.802",
                  usd: 125.75
                },
                percentage: 6.64
              },
              {
                token: {
                  address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                  name: "Bonk",
                  symbol: "BONK",
                  logo: "https://assets.solana.fm/token/icon/png/bonk.png"
                },
                quantity: "5731429.23",
                value: {
                  solana: "0.812",
                  usd: 125.62
                },
                percentage: 6.63
              }
            ]
          }
        };
      }
      
      return result;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      // Fall back to mock data
      return {
        nativeBalance: {
          solana: "10.5",
          usd: 1642.35
        },
        tokens: [
          {
            associatedTokenAddress: "ATxhBRNuPpQsRm9L9hFrEF9NPAVp3gxPjPaQQKaGDtKQ",
            mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            amount: "125.75",
            amountRaw: "125750000",
            decimals: 6,
            name: "USD Coin",
            symbol: "USDC"
          },
          {
            associatedTokenAddress: "BZCPpva12M9SqJgcpf6ZXoZ7GqKUGPPMLK5TuJZzATzV",
            mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
            amount: "5731429.23",
            amountRaw: "5731429234567",
            decimals: 5,
            name: "Bonk",
            symbol: "BONK"
          }
        ]
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Function to fetch new tokens
  const fetchNewTokens = async (exchange: string): Promise<any> => {
    setIsProcessing(true);
    
    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': MORALIS_API_KEY
        }
      };

      const response = await fetch(`https://solana-gateway.moralis.io/token/mainnet/exchange/${exchange}/new?limit=100`, options);
      
      if (!response.ok) {
        throw new Error(`Could not fetch new tokens for ${exchange}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching new tokens for ${exchange}:`, error);
      // Fall back to mock data
      return [
        {
          name: "Sample New Token 1",
          address: "FSWBrRF5Cxp7wqxV7nSEUYeKNbQQMZuYU3NbhpKdQHeb",
          symbol: "SNT1",
          created_at: new Date().toISOString(),
          price: 0.00034,
          price_change_24h: 152.3,
          volume_24h: 45732.12
        },
        {
          name: "Sample New Token 2",
          address: "GcX5eUrWvNrt9a8XVfnvj6NbdDAFJdMV1VrXQSYZRgAu",
          symbol: "SNT2",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          price: 0.00078,
          price_change_24h: 87.4,
          volume_24h: 32410.67
        }
      ];
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Function to fetch trending tokens
  const fetchTrendingTokens = async (chain: string, limit: number): Promise<any> => {
    setIsProcessing(true);
    
    try {
      const response = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/trending?chain=${chain}&limit=${limit}`, {
        headers: {
          "Accept": "application/json",
          "X-API-Key": MORALIS_API_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error(`Could not fetch trending tokens for ${chain}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching trending tokens for ${chain}:`, error);
      // Fall back to mock data
      return [
        {
          name: "Jupiter",
          symbol: "JUP",
          address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
          price: 1.62,
          price_change_24h: 5.7,
          volume_24h: 125304890.34
        },
        {
          name: "Bonk",
          symbol: "BONK",
          address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
          price: 0.00002893,
          price_change_24h: -2.1,
          volume_24h: 87203456.78
        },
        {
          name: "Jito",
          symbol: "JTO",
          address: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
          price: 3.18,
          price_change_24h: 1.2,
          volume_24h: 43987654.32
        }
      ];
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Function to fetch holder stats
  const fetchHolderStats = async (address: string): Promise<any> => {
    setIsProcessing(true);
    
    try {
      const response = await fetch(`https://solana-gateway.moralis.io/token/mainnet/holders/${address}`, {
        headers: {
          "Accept": "application/json",
          "X-API-Key": MORALIS_API_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error(`Could not fetch holder stats for ${address}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching holder stats for ${address}:`, error);
      // Fall back to mock data
      return {
        token: {
          name: "Sample Token",
          symbol: "SMPL",
          address: address,
          supply: "1000000000"
        },
        total_holders: 12547,
        holders_by_balance: [
          { balance_range: "0-100", count: 8764 },
          { balance_range: "101-1000", count: 2453 },
          { balance_range: "1001-10000", count: 1021 },
          { balance_range: "10001-100000", count: 284 },
          { balance_range: "100001+", count: 25 }
        ],
        top_holders: [
          { address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", balance: "125000000", percentage: 12.5 },
          { address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", balance: "87500000", percentage: 8.75 }
        ]
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Function to search for tokens
  const searchTokens = async (query: string, chain: string): Promise<any> => {
    setIsProcessing(true);
    
    try {
      const response = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/search?chain=${chain}&query=${query}`, {
        headers: {
          "Accept": "application/json",
          "X-API-Key": MORALIS_API_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error(`Could not search for tokens with query ${query}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error searching for tokens with query ${query}:`, error);
      // Fall back to mock data
      return [
        {
          name: "Jupiter",
          symbol: "JUP",
          address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
          decimals: 6,
          chain: "solana",
          exchange: "raydium"
        },
        {
          name: "Jupiter Perpetuals",
          symbol: "JUPPERP",
          address: "Perp3umGDGYP39K3uvRxvnwFD6XJxzM3NNB5G69xmy7",
          decimals: 6,
          chain: "solana",
          exchange: "drift"
        }
      ];
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden relative">
      {/* Futuristic background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden opacity-20">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] left-[30%] w-1/3 h-1/3 bg-info/5 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
      </div>
      
      {/* Floating Sidebar */}
      <div className="fixed top-1/2 -translate-y-1/2 left-8 z-50 glass rounded-full py-6 px-4 border border-white/10 shadow-xl backdrop-blur-md bg-black/30">
        <div className="flex flex-col items-center gap-8">
          <Link href="/" className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center relative group">
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite] group-hover:border-primary/40 transition-colors"></div>
            <Image 
              src="/inferno-logo.svg" 
              alt="Syntrada" 
              width={32} 
              height={32}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
          
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center glow-primary relative group">
            <div className="absolute inset-0 rounded-full border border-primary/40 group-hover:border-primary/60 transition-colors"></div>
            <Image 
              src="/module-blazebot.svg" 
              alt="BlazeBot" 
              width={28} 
              height={28}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          <Link href="/app/tokentorch" className="w-14 h-14 rounded-full hover:bg-white/5 flex items-center justify-center transition-all duration-300 group">
            <Image 
              src="/module-tokentorch.svg" 
              alt="TokenTorch" 
              width={28} 
              height={28}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
          
          <Link href="/app/flamefeed" className="w-14 h-14 rounded-full hover:bg-white/5 flex items-center justify-center transition-all duration-300 group">
            <Image 
              src="/module-flamefeed.svg" 
              alt="FlameFeed" 
              width={28} 
              height={28}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>

          <Link href="/app/calidatrade" className="w-14 h-14 rounded-full hover:bg-white/5 flex items-center justify-center transition-all duration-300 group">
            <Image 
              src="/module-calida.svg" 
              alt="CalidaTrade" 
              width={28} 
              height={28}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-28 z-10">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between backdrop-blur-sm bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center relative group">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite] group-hover:border-primary/40 transition-colors"></div>
              <Image 
                src="/module-blazebot.svg" 
                alt="BlazeBot" 
                width={24} 
                height={24}
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-primary/70 bg-clip-text text-transparent">BlazeBot</h1>
          </div>
          <button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-4 py-2 rounded-full text-sm font-medium shadow-glow transition-all duration-300 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Pro Mode
          </button>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 bg-grid-white/[0.01] bg-[length:30px_30px]">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'ml-auto' : ''}`}>
              {msg.role === 'user' ? (
                // User message
                <div className="rounded-xl p-4 glass backdrop-blur-md shadow-lg bg-primary/10 border border-primary/20">
                  {typeof msg.content === 'string' ? msg.content : 
                    'content' in msg.content ? msg.content.content : 'Message'}
                </div>
              ) : (
                // System message
                typeof msg.content === 'string' ? (
                  // Regular text message
                  <div className="rounded-xl p-4 glass backdrop-blur-md shadow-lg bg-black/20 border border-white/10">
                    {msg.content === 'Analyzing your request...' ? (
                      <>
                        <p>{msg.content}</p>
                        <div className="mt-2 flex items-center">
                          <div className="animate-pulse flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-primary/70"></div>
                            <div className="h-2 w-2 rounded-full bg-primary/70 animation-delay-200"></div>
                            <div className="h-2 w-2 rounded-full bg-primary/70 animation-delay-400"></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                ) : (
                  // Handle structured content
                  'type' in msg.content ? (
                    msg.content.type === 'token_analysis' ? (
                      // Token analysis card
                      <TokenAnalysisCard 
                        tokenData={msg.content.tokenData} 
                        analysis={msg.content.analysis} 
                      />
                    ) : (
                      // Text content type
                      <div className="rounded-xl p-4 glass backdrop-blur-md shadow-lg bg-black/20 border border-white/10">
                        <p>{msg.content.content}</p>
                      </div>
                    )
                  ) : (
                    // Fallback for unexpected content structure
                    <div className="rounded-xl p-4 glass backdrop-blur-md shadow-lg bg-black/20 border border-white/10">
                      <p>Unable to display message</p>
                    </div>
                  )
                )
              )}
            </div>
          ))}
          
          {messages.length === 1 && (
            <div className="max-w-2xl mx-auto my-10 glass backdrop-blur-md bg-black/30 border border-white/10 rounded-xl p-6 shadow-lg relative overflow-hidden group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 via-transparent to-transparent blur-md opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent">
                      <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="font-bold">Quick Instructions</h3>
                </div>
                <p className="text-sm mb-4">BlazeBot can analyze token data and provide insights. Try asking about:</p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    "Tell me about SOL"
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    "What's the price of JUP?"
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    "Is BONK a good investment?"
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Paste any token contract address
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t border-white/10 backdrop-blur-md bg-black/30">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && message.trim() && !isProcessing) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Ask about tokens, paste contract addresses, or ask for market insights..."
              className="flex-1 bg-white/5 border border-white/10 hover:border-primary/30 focus:border-primary/50 transition-colors rounded-xl px-4 py-3 outline-none"
              disabled={isProcessing}
            />
            <button 
              onClick={handleSubmit}
              disabled={!message.trim() || isProcessing}
              className={`${
                isProcessing || !message.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:from-primary/90 hover:to-accent/90'
              } bg-gradient-to-r from-primary to-accent px-6 py-3 rounded-xl shadow-glow transition-all duration-300`}
            >
              {isProcessing ? (
                <div className="animate-pulse flex space-x-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-white animation-delay-200"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-white animation-delay-400"></div>
                </div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          <div className="mt-2 text-center text-xs text-white/50">
            {isProcessing ? "Processing your request..." : "Type a message and press Enter to send"}
          </div>
        </div>
      </div>
    </div>
  );
} 