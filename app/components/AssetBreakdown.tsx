'use client';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Token {
  associatedTokenAddress: string;
  mint: string;
  name: string;
  symbol: string;
  amount: string;
  amountRaw: string;
  decimals: string;
}

interface NFT {
  associatedTokenAddress: string;
  mint: string;
  name: string;
  symbol: string;
}

interface WalletData {
  nativeBalance: {
    solana: string;
    lamports: string;
  };
  tokens: Token[];
  nfts: NFT[];
}

interface AssetBreakdownProps {
  data: WalletData;
}

export default function AssetBreakdown({ data }: AssetBreakdownProps) {
  return (
    <Card className="bg-[#1A1A1A] p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">Asset Breakdown</h3>
      
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-2 text-white">Native Balance</h4>
        <p className="text-2xl font-bold text-[#FF3A00]">
          {parseFloat(data.nativeBalance.solana).toFixed(4)} SOL
        </p>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-2 text-white">Tokens</h4>
        <div className="rounded-md border border-[#333]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Token</TableHead>
                <TableHead className="text-right text-white">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.tokens.map((token) => (
                <TableRow key={token.mint}>
                  <TableCell className="font-medium text-gray-300">
                    {token.symbol}
                  </TableCell>
                  <TableCell className="text-right text-gray-300">
                    {parseFloat(token.amount).toFixed(4)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium mb-2 text-white">NFTs</h4>
        <div className="rounded-md border border-[#333]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-right text-white">Symbol</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.nfts.map((nft) => (
                <TableRow key={nft.mint}>
                  <TableCell className="font-medium text-gray-300">
                    {nft.name}
                  </TableCell>
                  <TableCell className="text-right text-gray-300">
                    {nft.symbol}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
} 