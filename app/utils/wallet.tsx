'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface WalletContextType {
  wallet: WalletContextState | null;
  publicKey: string | null;
  balance: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  fetchBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  publicKey: null,
  balance: null,
  connect: async () => {},
  disconnect: async () => {},
  fetchBalance: async () => {},
});

const connection = new Connection('https://api.mainnet-beta.solana.com');

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const solanaWallet = useSolanaWallet();
  const { setVisible } = useWalletModal();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  const fetchBalance = async () => {
    if (!solanaWallet.publicKey) {
      setBalance(null);
      return;
    }
    try {
      const balance = await connection.getBalance(solanaWallet.publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setBalance(null);
    }
  };

  useEffect(() => {
    if (solanaWallet.publicKey) {
      setPublicKey(solanaWallet.publicKey.toString());
      fetchBalance();
    } else {
      setPublicKey(null);
      setBalance(null);
    }
  }, [solanaWallet.publicKey]);

  const connect = async () => {
    try {
      setVisible(true);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      throw err;
    }
  };

  const disconnect = async () => {
    try {
      await solanaWallet.disconnect();
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
      throw err;
    }
  };

  return (
    <WalletContext.Provider value={{ 
      wallet: solanaWallet, 
      publicKey, 
      balance,
      connect, 
      disconnect,
      fetchBalance
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext); 