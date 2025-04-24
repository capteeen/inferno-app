'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WalletHeaderProps {
  onSubmit: (address: string) => void;
  isLoading: boolean;
  error?: string;
}

export default function WalletHeader({ onSubmit, isLoading, error }: WalletHeaderProps) {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSubmit(address.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-semibold text-white">Analyze Wallet</h2>
        <p className="text-gray-400">Enter a Solana wallet address to analyze its portfolio and activity</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="Enter wallet address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-1 bg-[#121212] border-[#333] text-white"
        />
        <Button 
          type="submit" 
          disabled={!address.trim() || isLoading}
          className="bg-[#FF3A00] hover:bg-[#FF5500] text-white"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 