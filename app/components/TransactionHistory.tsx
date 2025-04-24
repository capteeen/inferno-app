'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Transaction {
  transactionHash: string;
  transactionType: string;
  blockTimestamp: string;
  exchangeName: string;
  bought: {
    name: string;
    symbol: string;
    amount: string;
    usdAmount: number;
  };
  sold: {
    name: string;
    symbol: string;
    amount: string;
    usdAmount: number;
  };
  totalValueUsd: number;
}

interface TransactionHistoryProps {
  address: string;
}

export default function TransactionHistory({ address }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('TransactionHistory mounted with address:', address);
    
    const fetchTransactions = async () => {
      if (!address) {
        console.log('No address provided, skipping fetch');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching transactions for address:', address);
        const response = await fetch(`/api/wallet/transactions?address=${address}`);
        console.log('Response status:', response.status);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch transactions');
        }
        const data = await response.json();
        console.log('Received data:', data);
        setTransactions(data.result || []);
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  if (loading) return <Card className="bg-[#1A1A1A] p-6">Loading transactions...</Card>;
  if (error) return <Card className="bg-[#1A1A1A] p-6">Error: {error}</Card>;

  return (
    <Card className="bg-[#1A1A1A] p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">Transaction History</h3>
      {transactions.length === 0 ? (
        <p className="text-gray-400">No transactions found</p>
      ) : (
        <div className="rounded-md border border-[#333] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Type</TableHead>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Exchange</TableHead>
                <TableHead className="text-right text-white">Amount</TableHead>
                <TableHead className="text-right text-white">Value (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.transactionHash} className="hover:bg-[#2A2A2A]">
                  <TableCell className="font-medium text-gray-300">
                    <span className={`px-2 py-1 rounded ${
                      tx.transactionType === 'buy' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {tx.transactionType.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(tx.blockTimestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-300">{tx.exchangeName}</TableCell>
                  <TableCell className="text-right text-gray-300">
                    {tx.transactionType === 'buy' ? (
                      <>
                        {parseFloat(tx.bought.amount).toFixed(4)} {tx.bought.symbol}
                      </>
                    ) : (
                      <>
                        {parseFloat(tx.sold.amount).toFixed(4)} {tx.sold.symbol}
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-gray-300">
                    ${tx.totalValueUsd.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
} 