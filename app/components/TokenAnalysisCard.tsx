import React from 'react';
import { formatNumber, formatPrice, formatPercentage } from '../utils/format';

interface TokenData {
  name: string;
  symbol: string;
  contractAddress: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  network: string;
  riskLevel: string;
}

interface TokenAnalysisProps {
  tokenData: TokenData;
  analysis: string;
}

const TokenAnalysisCard: React.FC<TokenAnalysisProps> = ({ tokenData, analysis }) => {
  const {
    name,
    symbol,
    contractAddress,
    price,
    priceChange24h,
    marketCap,
    network,
    riskLevel
  } = tokenData;

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="rounded-xl p-6 glass backdrop-blur-md shadow-lg bg-black/20 border border-white/10 relative overflow-hidden group">
      {/* Gradient background effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-accent/10 to-transparent blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold">{symbol[0]}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="text-sm text-white/60">{symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${formatPrice(price)}</div>
            <div className={`text-sm ${getPriceChangeColor(priceChange24h)}`}>
              {formatPercentage(priceChange24h)}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Market Cap</p>
            <p className="text-lg font-semibold">${formatNumber(marketCap)}</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Network</p>
            <p className="text-lg font-semibold capitalize">{network}</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Risk Level</p>
            <p className={`text-lg font-semibold ${getRiskLevelColor(riskLevel)}`}>
              {riskLevel}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-white/60 mb-1">Contract</p>
            <p className="text-sm font-mono truncate" title={contractAddress}>
              {contractAddress}
            </p>
          </div>
        </div>

        {/* Analysis */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm text-white/60 mb-2">Analysis</p>
          <p className="text-sm leading-relaxed">{analysis}</p>
        </div>
      </div>
    </div>
  );
};

export default TokenAnalysisCard; 