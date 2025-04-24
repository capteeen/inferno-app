import { NextResponse } from 'next/server';
import Moralis from 'moralis';

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Check if Moralis is already started
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
      });
    }

    // Fetch wallet data from Moralis
    const response = await Moralis.SolApi.account.getPortfolio({
      network: 'mainnet',
      address: address,
    });

    return NextResponse.json(response.raw);
  } catch (error: any) {
    console.error('Wallet analysis error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to analyze wallet' },
      { status: 500 }
    );
  }
} 