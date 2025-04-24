'use client';

import { useState } from 'react';
import WalletHeader from '@/components/WalletHeader';
import AssetBreakdown from '@/components/AssetBreakdown';
import TransactionHistory from '@/components/TransactionHistory';
import RiskAssessment from '@/components/RiskAssessment';
import SmartSuggestions from '@/components/SmartSuggestions';
import { Card } from '@/components/ui/card';

export default function WalletWarden() {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletData, setWalletData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeWallet = async (address: string) => {
    setIsLoading(true);
    setError('');
    setWalletAddress(address);
    try {
      const response = await fetch('/api/wallet/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to analyze wallet');
      
      setWalletData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">WalletWarden</h1>
      
      <Card className="bg-[#1A1A1A] p-6 mb-8">
        <WalletHeader 
          onSubmit={analyzeWallet}
          isLoading={isLoading}
          error={error}
        />
      </Card>

      {walletData && (
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          <AssetBreakdown data={walletData} />
          <RiskAssessment data={walletData} />
          <TransactionHistory address={walletAddress} />
          <SmartSuggestions data={walletData} />
        </div>
      )}
    </div>
  );
} 