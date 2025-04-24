import { NextResponse } from 'next/server';
import Moralis from 'moralis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    console.log('Fetching transactions for address:', address);

    // Check if Moralis is already started
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
      });
    }

    // Fetch transactions from Moralis
    const response = await Moralis.SolApi.account.getPortfolio({
      network: 'mainnet',
      address: address,
    });

    console.log('Moralis response:', response);

    // Transform the response into the expected format
    const transactions = response.raw.tokens?.map((token: any) => ({
      transactionHash: token.mint,
      transactionType: 'buy',
      blockTimestamp: new Date().toISOString(),
      exchangeName: 'Solana',
      bought: {
        name: token.name,
        symbol: token.symbol,
        amount: token.amount,
        usdAmount: parseFloat(token.amount) * (token.usdPrice || 0)
      },
      sold: {
        name: 'SOL',
        symbol: 'SOL',
        amount: '0',
        usdAmount: 0
      },
      totalValueUsd: parseFloat(token.amount) * (token.usdPrice || 0)
    })) || [];

    return NextResponse.json({ result: transactions });
  } catch (error: any) {
    console.error('Transaction history error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
} 