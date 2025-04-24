'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatNumber, formatPrice, formatPercentage } from '../../utils/format';

interface AIAnalysis {
  safetyScore: number;
  technicalAnalysis: {
    trend: {
      direction: 'bullish' | 'bearish' | 'neutral';
      strength: number;
      keyLevels: {
        support: number;
        resistance: number;
      };
      momentum: {
        rsi: number;
        macd: {
          value: number;
          signal: number;
          histogram: number;
        };
      };
    };
    volumeAnalysis: {
      buyPressure: number;
      sellPressure: number;
      volumeProfile: string;
      abnormalVolume: boolean;
    };
    marketStructure: {
      liquidityRating: number;
      marketEfficiency: number;
      volatilityScore: number;
      priceDiscovery: string;
    };
    riskMetrics: {
      sharpeRatio: number;
      maxDrawdown: number;
      volatility: number;
      betaToSol: number;
    };
  };
  insights: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  lastUpdated: string;
}

interface TokenData {
  name: string;
  symbol: string;
  contract: string;
  dex: string;
  price: number;
  liquidity: number;
  marketCap: number;
  fdv: number;
  trustScore: number;
  metadata: {
    decimals: number;
    totalSupply: string;
    totalSupplyFormatted: string;
    owner: string;
    verified: boolean;
    logo: string;
    standard: string;
    metaplex: {
      metadataUri: string;
      masterEdition: boolean;
      isMutable: boolean;
      sellerFeeBasisPoints: number;
      updateAuthority: string;
      primarySaleHappened: number;
    };
  };
  balances: {
    totalHolders: number;
    topHolders: Array<{
      address: string;
      balance: string;
      percentage: number;
    }>;
  };
  pairs: Array<{
    dex: string;
    pair: string;
    liquidity: number;
    volume24h: number;
  }>;
  volumeStats: {
    volume24h: number;
    transactions24h: number;
    buys24h: number;
    sells24h: number;
    averageTradeSize: number;
  };
  snipers: Array<{
    address: string;
    trades: number;
    profit: number;
    successRate: number;
  }>;
  authorities: {
    mint: boolean;
    freeze: boolean;
    liquidityLocked: boolean;
  };
  trading: {
    volume24h: number;
    transactions24h: number;
    priceChange24h: number;
  };
  analytics: {
    totalBuyVolume: {
      "5m": number;
      "1h": number;
      "6h": number;
      "24h": number;
    };
    totalSellVolume: {
      "5m": number;
      "1h": number;
      "6h": number;
      "24h": number;
    };
    totalBuyers: {
      "5m": number;
      "1h": number;
      "6h": number;
      "24h": number;
    };
    totalSellers: {
      "5m": number;
      "1h": number;
      "6h": number;
      "24h": number;
    };
    totalBuys: {
      "5m": number;
      "1h": number;
      "6h": number;
      "24h": number;
    };
    totalSells: {
      "5m": number;
      "1h": number;
      "6h": number;
      "24h": number;
    };
    totalLiquidityUsd: string;
    totalFullyDilutedValuation: string;
  };
  aiAnalysis: AIAnalysis;
}

export default function TokenTorch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('metadata');

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Fetch token metadata from Moralis
      const metadataResponse = await fetch(
        `https://solana-gateway.moralis.io/token/mainnet/${searchQuery}/metadata`,
        {
          headers: {
            'accept': 'application/json',
            'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImVjYzAxZDliLTdjYWItNDgzYy1hZDUzLTY4ZGMxMTkwZjZjNCIsIm9yZ0lkIjoiNDkyMTEiLCJ1c2VySWQiOiI0ODg3NiIsInR5cGVJZCI6IjUwMTgwNWE5LTVkNWEtNDI3OC1hMjE4LWIxNGFhYTU0OTljMCIsInR5cGUiOiJQUk9KRUNUIiwiaWF0IjoxNzQ0NTYzODI2LCJleHAiOjQ5MDAzMjM4MjZ9.XxbCVueyjps5wYAkl8AwuywxhBcw1xkieimSI_yOtfA'
          }
        }
      );

      if (!metadataResponse.ok) {
        throw new Error('Failed to fetch token metadata');
      }

      const metadata = await metadataResponse.json();

      // Fetch token price data from Moralis
      const priceResponse = await fetch(
        `https://solana-gateway.moralis.io/token/mainnet/${searchQuery}/price`,
        {
          headers: {
            'accept': 'application/json',
            'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImVjYzAxZDliLTdjYWItNDgzYy1hZDUzLTY4ZGMxMTkwZjZjNCIsIm9yZ0lkIjoiNDkyMTEiLCJ1c2VySWQiOiI0ODg3NiIsInR5cGVJZCI6IjUwMTgwNWE5LTVkNWEtNDI3OC1hMjE4LWIxNGFhYTU0OTljMCIsInR5cGUiOiJQUk9KRUNUIiwiaWF0IjoxNzQ0NTYzODI2LCJleHAiOjQ5MDAzMjM4MjZ9.XxbCVueyjps5wYAkl8AwuywxhBcw1xkieimSI_yOtfA'
          }
        }
      );

      if (!priceResponse.ok) {
        throw new Error('Failed to fetch token price');
      }

      const priceData = await priceResponse.json();

      // Fetch token analytics from Moralis
      const analyticsResponse = await fetch(
        `https://deep-index.moralis.io/api/v2.2/tokens/${searchQuery}/analytics?chain=solana`,
        {
          headers: {
            'accept': 'application/json',
            'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImVjYzAxZDliLTdjYWItNDgzYy1hZDUzLTY4ZGMxMTkwZjZjNCIsIm9yZ0lkIjoiNDkyMTEiLCJ1c2VySWQiOiI0ODg3NiIsInR5cGVJZCI6IjUwMTgwNWE5LTVkNWEtNDI3OC1hMjE4LWIxNGFhYTU0OTljMCIsInR5cGUiOiJQUk9KRUNUIiwiaWF0IjoxNzQ0NTYzODI2LCJleHAiOjQ5MDAzMjM4MjZ9.XxbCVueyjps5wYAkl8AwuywxhBcw1xkieimSI_yOtfA'
          }
        }
      );

      if (!analyticsResponse.ok) {
        throw new Error('Failed to fetch token analytics');
      }

      const analytics = await analyticsResponse.json();

      // Calculate 24h price change percentage
      const currentPrice = parseFloat(priceData.usdPrice) || 0;
      const price24hAgo = parseFloat(priceData.price24hAgo) || currentPrice;
      const priceChange24h = price24hAgo > 0 ? ((currentPrice - price24hAgo) / price24hAgo) * 100 : 0;

      console.log('Price data:', {
        currentPrice,
        price24hAgo,
        priceChange24h,
        rawPriceData: priceData
      });

      // Add mock AI analysis (replace with actual OpenAI call later)
      const aiAnalysis = {
        safetyScore: 85,
        technicalAnalysis: {
          trend: {
            direction: 'bullish',
            strength: 75,
            keyLevels: {
              support: currentPrice * 0.85,
              resistance: currentPrice * 1.25
            },
            momentum: {
              rsi: 65,
              macd: {
                value: 0.0023,
                signal: 0.0018,
                histogram: 0.0005
              }
            }
          },
          volumeAnalysis: {
            buyPressure: 65,
            sellPressure: 35,
            volumeProfile: "Accumulation phase with increasing buy volume",
            abnormalVolume: false
          },
          marketStructure: {
            liquidityRating: 78,
            marketEfficiency: 82,
            volatilityScore: 45,
            priceDiscovery: "Efficient with strong market depth"
          },
          riskMetrics: {
            sharpeRatio: 2.1,
            maxDrawdown: 28,
            volatility: 75,
            betaToSol: 1.2
          }
        },
        insights: {
          summary: "Token displays strong technical fundamentals with healthy market structure and above-average liquidity metrics. Volume analysis suggests accumulation phase with institutional interest.",
          strengths: [
            "Strong market depth with balanced order books",
            "Positive momentum indicators with bullish MACD crossover",
            "Above-average liquidity metrics",
            "Healthy Sharpe ratio indicating good risk-adjusted returns"
          ],
          weaknesses: [
            "Moderate volatility levels require active risk management",
            "Price discovery efficiency could be improved",
            "Beta suggests high correlation with SOL movements"
          ],
          opportunities: [
            "Accumulation pattern suggests potential breakout",
            "Strong support levels provide favorable risk/reward",
            "Technical indicators align for potential upward movement"
          ],
          threats: [
            "Market volatility may impact short-term price stability",
            "Resistance levels could cap immediate upside",
            "Correlation with SOL exposes to market-wide risks"
          ]
        },
        lastUpdated: new Date().toISOString()
      } as AIAnalysis;

      // Set token data with the actual Moralis response
      setTokenData({
        name: metadata.name || 'Unknown Token',
        symbol: metadata.symbol || 'UNKNOWN',
        contract: metadata.mint || searchQuery,
        dex: "pumpswap",
        price: currentPrice,
        liquidity: parseFloat(analytics.totalLiquidityUsd) || 0,
        marketCap: parseFloat(metadata.fullyDilutedValue) || 0,
        fdv: parseFloat(metadata.fullyDilutedValue) || 0,
        trustScore: 0,
        metadata: {
          decimals: parseInt(metadata.decimals) || 9,
          totalSupply: metadata.totalSupply || "0",
          totalSupplyFormatted: metadata.totalSupplyFormatted || "0",
          owner: metadata.metaplex?.updateAuthority || searchQuery,
          verified: true,
          logo: metadata.logo || "",
          standard: metadata.standard || "",
          metaplex: {
            metadataUri: metadata.metaplex?.metadataUri || "",
            masterEdition: metadata.metaplex?.masterEdition || false,
            isMutable: metadata.metaplex?.isMutable || false,
            sellerFeeBasisPoints: metadata.metaplex?.sellerFeeBasisPoints || 0,
            updateAuthority: metadata.metaplex?.updateAuthority || "",
            primarySaleHappened: metadata.metaplex?.primarySaleHappened || 0
          }
        },
        balances: {
          totalHolders: 0,
          topHolders: []
        },
        pairs: [],
        volumeStats: {
          volume24h: parseFloat(analytics.totalBuyVolume["24h"]) + parseFloat(analytics.totalSellVolume["24h"]) || 0,
          transactions24h: analytics.totalBuys["24h"] + analytics.totalSells["24h"] || 0,
          buys24h: analytics.totalBuys["24h"] || 0,
          sells24h: analytics.totalSells["24h"] || 0,
          averageTradeSize: 0
        },
        snipers: [],
        authorities: {
          mint: true,
          freeze: false,
          liquidityLocked: false
        },
        trading: {
          volume24h: parseFloat(analytics.totalBuyVolume["24h"]) + parseFloat(analytics.totalSellVolume["24h"]) || 0,
          transactions24h: analytics.totalBuys["24h"] + analytics.totalSells["24h"] || 0,
          priceChange24h: priceChange24h
        },
        analytics: {
          totalBuyVolume: analytics.totalBuyVolume,
          totalSellVolume: analytics.totalSellVolume,
          totalBuyers: analytics.totalBuyers,
          totalSellers: analytics.totalSellers,
          totalBuys: analytics.totalBuys,
          totalSells: analytics.totalSells,
          totalLiquidityUsd: analytics.totalLiquidityUsd,
          totalFullyDilutedValuation: analytics.totalFullyDilutedValuation
        },
        aiAnalysis: aiAnalysis,
      });
    } catch (error) {
      console.error('Error fetching token data:', error);
      // TODO: Add error handling UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white relative">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_100%)]"></div>
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
          
          <Link href="/app/blazebot" className="w-14 h-14 rounded-full hover:bg-white/5 flex items-center justify-center transition-all duration-300 group">
            <Image 
              src="/module-blazebot.svg" 
              alt="BlazeBot" 
              width={28} 
              height={28}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
          
          <Link href="/app/tokentorch" className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center glow-primary relative group">
            <div className="absolute inset-0 rounded-full border border-primary/40 group-hover:border-primary/60 transition-colors"></div>
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

      {/* Main content */}
      <div className="relative z-10 ml-28">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between backdrop-blur-sm bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center relative group">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite] group-hover:border-primary/40 transition-colors"></div>
              <Image 
                src="/module-tokentorch.svg" 
                alt="TokenTorch" 
                width={24} 
                height={24}
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-primary/70 bg-clip-text text-transparent">TokenTorch</h1>
          </div>
          <button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-4 py-2 rounded-full text-sm font-medium shadow-glow transition-all duration-300 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Pro Mode
          </button>
        </div>

        {/* Main content area */}
        <main className="p-6">
          {/* Search input */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSearch();
                  }
                }}
                placeholder="Enter token address to analyze..."
                className="w-full bg-black/20 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 focus:border-blue-500/50 transition-all duration-300 rounded-xl px-4 py-3 pl-12 outline-none placeholder-white/30"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Token data content */}
          {tokenData && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Basic Token Info Card */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none"></div>
                <div className="p-6 relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center overflow-hidden border border-white/10">
                        {tokenData.metadata.logo ? (
                          <img
                            src={tokenData.metadata.logo}
                            alt={tokenData.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('.fallback');
                              if (fallback) {
                                fallback.classList.remove('hidden');
                              }
                            }}
                          />
                        ) : null}
                        <div className={`fallback ${tokenData.metadata.logo ? 'hidden' : ''} text-2xl font-bold`}>
                          {tokenData.symbol[0]}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{tokenData.name}</h2>
                        <div className="flex items-center gap-2">
                          <span className="text-white/60">{tokenData.symbol}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                            {tokenData.contract}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {/* Add to watchlist logic */}} 
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-sm text-white/60 mb-1">Price</div>
                      <div className="font-mono font-bold">${formatNumber(tokenData.price)}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-sm text-white/60 mb-1">Market Cap</div>
                      <div className="font-mono font-bold">${formatNumber(tokenData.marketCap)}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-sm text-white/60 mb-1">Liquidity</div>
                      <div className="font-mono font-bold">${formatNumber(tokenData.liquidity)}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-sm text-white/60 mb-1">24h Buys/Sells</div>
                      <div className="font-mono font-bold">
                        {tokenData.analytics.totalBuys["24h"]}/{tokenData.analytics.totalSells["24h"]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Token Details in a Single View */}
              <div className="space-y-6">
                {/* Metadata Section */}
                <div className="rounded-xl overflow-hidden backdrop-blur-md border border-white/10 shadow-2xl bg-black/40 p-6">
                  <h3 className="text-lg font-medium mb-4">Token Metadata</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">Decimals</div>
                      <div className="font-mono font-bold">{tokenData.metadata.decimals}</div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">Total Supply</div>
                      <div className="font-mono font-bold">{formatNumber(parseInt(tokenData.metadata.totalSupply))}</div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">Owner</div>
                      <div className="font-mono text-sm truncate">{tokenData.metadata.owner}</div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">Verified</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${tokenData.metadata.verified ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span>{tokenData.metadata.verified ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Analytics Section */}
                <div className="rounded-xl overflow-hidden backdrop-blur-md border border-white/10 shadow-2xl bg-black/40 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Advanced Technical Analysis</h3>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Last updated: {new Date(tokenData.aiAnalysis.lastUpdated).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Technical Analysis Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Trend Analysis */}
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <h4 className="font-medium mb-3">Trend Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Direction</span>
                          <span className={`text-sm font-mono ${
                            tokenData.aiAnalysis.technicalAnalysis.trend.direction === 'bullish' ? 'text-green-400' :
                            tokenData.aiAnalysis.technicalAnalysis.trend.direction === 'bearish' ? 'text-red-400' :
                            'text-yellow-400'
                          }`}>
                            {tokenData.aiAnalysis.technicalAnalysis.trend.direction.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Trend Strength</span>
                          <span className="text-sm font-mono">{tokenData.aiAnalysis.technicalAnalysis.trend.strength}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">RSI</span>
                          <span className="text-sm font-mono">{tokenData.aiAnalysis.technicalAnalysis.trend.momentum.rsi}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">MACD</span>
                          <span className={`text-sm font-mono ${
                            tokenData.aiAnalysis.technicalAnalysis.trend.momentum.macd.histogram > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {tokenData.aiAnalysis.technicalAnalysis.trend.momentum.macd.value.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Market Structure */}
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <h4 className="font-medium mb-3">Market Structure</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Liquidity Rating</span>
                          <span className="text-sm font-mono">{tokenData.aiAnalysis.technicalAnalysis.marketStructure.liquidityRating}/100</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Market Efficiency</span>
                          <span className="text-sm font-mono">{tokenData.aiAnalysis.technicalAnalysis.marketStructure.marketEfficiency}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Volatility Score</span>
                          <span className="text-sm font-mono">{tokenData.aiAnalysis.technicalAnalysis.marketStructure.volatilityScore}/100</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Beta to SOL</span>
                          <span className="text-sm font-mono">{tokenData.aiAnalysis.technicalAnalysis.riskMetrics.betaToSol}</span>
                        </div>
                      </div>
                    </div>

                    {/* Volume Analysis */}
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <h4 className="font-medium mb-3">Volume Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Buy Pressure</span>
                          <span className="text-sm font-mono text-green-400">{tokenData.aiAnalysis.technicalAnalysis.volumeAnalysis.buyPressure}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Sell Pressure</span>
                          <span className="text-sm font-mono text-red-400">{tokenData.aiAnalysis.technicalAnalysis.volumeAnalysis.sellPressure}%</span>
                        </div>
                        <div className="text-sm text-white/60 mt-2">Volume Profile</div>
                        <div className="text-sm">{tokenData.aiAnalysis.technicalAnalysis.volumeAnalysis.volumeProfile}</div>
                      </div>
                    </div>

                    {/* Risk Metrics */}
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <h4 className="font-medium mb-3">Risk Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Sharpe Ratio</span>
                          <span className="text-sm font-mono">{tokenData.aiAnalysis.technicalAnalysis.riskMetrics.sharpeRatio.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Max Drawdown</span>
                          <span className="text-sm font-mono">{tokenData.aiAnalysis.technicalAnalysis.riskMetrics.maxDrawdown}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Volatility</span>
                          <span className="text-sm font-mono">{tokenData.aiAnalysis.technicalAnalysis.riskMetrics.volatility}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Levels */}
                  <div className="glass rounded-lg p-4 bg-white/5 mb-6">
                    <h4 className="font-medium mb-3">Key Price Levels</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-white/60 mb-1">Support</div>
                        <div className="text-lg font-mono text-green-400">${formatPrice(tokenData.aiAnalysis.technicalAnalysis.trend.keyLevels.support)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/60 mb-1">Resistance</div>
                        <div className="text-lg font-mono text-red-400">${formatPrice(tokenData.aiAnalysis.technicalAnalysis.trend.keyLevels.resistance)}</div>
                      </div>
                    </div>
                  </div>

                  {/* SWOT Analysis */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <h4 className="font-medium mb-3 text-green-400">Strengths</h4>
                      <ul className="space-y-2">
                        {tokenData.aiAnalysis.insights.strengths.map((strength, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <h4 className="font-medium mb-3 text-red-400">Weaknesses</h4>
                      <ul className="space-y-2">
                        {tokenData.aiAnalysis.insights.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <h4 className="font-medium mb-3 text-blue-400">Opportunities</h4>
                      <ul className="space-y-2">
                        {tokenData.aiAnalysis.insights.opportunities.map((opportunity, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <h4 className="font-medium mb-3 text-yellow-400">Threats</h4>
                      <ul className="space-y-2">
                        {tokenData.aiAnalysis.insights.threats.map((threat, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>{threat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Volume Stats Section */}
                <div className="rounded-xl overflow-hidden backdrop-blur-md border border-white/10 shadow-2xl bg-black/40 p-6">
                  <h3 className="text-lg font-medium mb-4">Volume Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">24h Volume</div>
                      <div className="font-mono font-bold">${formatNumber(tokenData.volumeStats.volume24h)}</div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">Transactions</div>
                      <div className="font-mono font-bold">{tokenData.volumeStats.transactions24h}</div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">Buys</div>
                      <div className="font-mono font-bold text-green-400">{tokenData.volumeStats.buys24h}</div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">Sells</div>
                      <div className="font-mono font-bold text-red-400">{tokenData.volumeStats.sells24h}</div>
                    </div>
                  </div>
                </div>

                {/* Analytics Overview Card */}
                <div className="rounded-xl overflow-hidden backdrop-blur-md border border-white/10 shadow-2xl bg-black/40 p-6">
                  <h3 className="text-lg font-medium mb-4">Trading Analytics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">5m Volume</div>
                      <div className="font-mono font-bold">
                        ${formatNumber(tokenData.analytics.totalBuyVolume["5m"] + tokenData.analytics.totalSellVolume["5m"])}
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">1h Volume</div>
                      <div className="font-mono font-bold">
                        ${formatNumber(tokenData.analytics.totalBuyVolume["1h"] + tokenData.analytics.totalSellVolume["1h"])}
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">6h Volume</div>
                      <div className="font-mono font-bold">
                        ${formatNumber(tokenData.analytics.totalBuyVolume["6h"] + tokenData.analytics.totalSellVolume["6h"])}
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">24h Volume</div>
                      <div className="font-mono font-bold">
                        ${formatNumber(tokenData.analytics.totalBuyVolume["24h"] + tokenData.analytics.totalSellVolume["24h"])}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buy/Sell Activity Card */}
                <div className="rounded-xl overflow-hidden backdrop-blur-md border border-white/10 shadow-2xl bg-black/40 p-6">
                  <h3 className="text-lg font-medium mb-4">Buy/Sell Activity</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">5m Buyers/Sellers</div>
                      <div className="font-mono font-bold">
                        {tokenData.analytics.totalBuyers["5m"]}/{tokenData.analytics.totalSellers["5m"]}
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">1h Buyers/Sellers</div>
                      <div className="font-mono font-bold">
                        {tokenData.analytics.totalBuyers["1h"]}/{tokenData.analytics.totalSellers["1h"]}
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">6h Buyers/Sellers</div>
                      <div className="font-mono font-bold">
                        {tokenData.analytics.totalBuyers["6h"]}/{tokenData.analytics.totalSellers["6h"]}
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">24h Buyers/Sellers</div>
                      <div className="font-mono font-bold">
                        {tokenData.analytics.totalBuyers["24h"]}/{tokenData.analytics.totalSellers["24h"]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Stats Card */}
                <div className="rounded-xl overflow-hidden backdrop-blur-md border border-white/10 shadow-2xl bg-black/40 p-6">
                  <h3 className="text-lg font-medium mb-4">Transaction Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">5m Buys/Sells</div>
                      <div className="font-mono font-bold">
                        {tokenData.analytics.totalBuys["5m"]}/{tokenData.analytics.totalSells["5m"]}
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">1h Buys/Sells</div>
                      <div className="font-mono font-bold">
                        {tokenData.analytics.totalBuys["1h"]}/{tokenData.analytics.totalSells["1h"]}
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">6h Buys/Sells</div>
                      <div className="font-mono font-bold">
                        {tokenData.analytics.totalBuys["6h"]}/{tokenData.analytics.totalSells["6h"]}
                      </div>
                    </div>
                    <div className="glass rounded-lg p-4 bg-white/5">
                      <div className="text-sm text-white/60 mb-1">24h Buys/Sells</div>
                      <div className="font-mono font-bold">
                        {tokenData.analytics.totalBuys["24h"]}/{tokenData.analytics.totalSells["24h"]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}