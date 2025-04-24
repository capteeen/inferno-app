'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWallet } from '../../utils/wallet';
import { WalletModal } from '../../components/WalletModal';
import { jupiterClient } from '../../utils/jupiter';
import { formatNumber, formatPrice, formatPercentage } from '../../utils/format';
import { Connection, Transaction, VersionedTransaction, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const connection = new Connection('https://api.mainnet-beta.solana.com');

interface TokenInfo {
  symbol: string;
  decimals: number;
  name: string;
  address: string;
}

interface TokenBalances {
  SOL: number;
  USDC: number;
  [key: string]: number;
}

// Add toast component
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-fade-in">
      <div className="bg-[#22c55e] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-white/10">
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default function CalidaTrade() {
  const { wallet, connect, disconnect, publicKey, balance, fetchBalance } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [slippage, setSlippage] = useState(0.5);
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [selectedInputToken, setSelectedInputToken] = useState('SOL');
  const [selectedOutputToken, setSelectedOutputToken] = useState('USDC');
  const [showInputTokenModal, setShowInputTokenModal] = useState(false);
  const [showOutputTokenModal, setShowOutputTokenModal] = useState(false);
  const [customInputAddress, setCustomInputAddress] = useState('');
  const [customOutputAddress, setCustomOutputAddress] = useState('');
  const [customTokens, setCustomTokens] = useState<Record<string, TokenInfo>>({});
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>({
    SOL: 0,
    USDC: 0
  });
  const [customPercentage, setCustomPercentage] = useState('');
  const [preSwapBalances, setPreSwapBalances] = useState<TokenBalances | null>(null);

  // Add effect to fetch balances when wallet connects
  useEffect(() => {
    if (publicKey) {
      fetchTokenBalances();
      // Set up an interval to refresh balances every 30 seconds
      const interval = setInterval(fetchTokenBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [publicKey]);

  // Function to fetch token balances using Moralis
  const fetchTokenBalances = async () => {
    if (!publicKey) {
      setTokenBalances({ SOL: 0, USDC: 0 });
      return;
    }

    try {
      const response = await fetch(
        `https://solana-gateway.moralis.io/account/mainnet/${publicKey}/portfolio?nftMetadata=true`,
        {
          headers: {
            'accept': 'application/json',
            'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImVjYzAxZDliLTdjYWItNDgzYy1hZDUzLTY4ZGMxMTkwZjZjNCIsIm9yZ0lkIjoiNDkyMTEiLCJ1c2VySWQiOiI0ODg3NiIsInR5cGVJZCI6IjUwMTgwNWE5LTVkNWEtNDI3OC1hMjE4LWIxNGFhYTU0OTljMCIsInR5cGUiOiJQUk9KRUNUIiwiaWF0IjoxNzQ0NTYzODI2LCJleHAiOjQ5MDAzMjM4MjZ9.XxbCVueyjps5wYAkl8AwuywxhBcw1xkieimSI_yOtfA'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch token balances');
      }

      const data = await response.json();
      console.log('Moralis portfolio data:', data);

      // Initialize balances with SOL and USDC
      const newBalances: TokenBalances = {
        SOL: 0,
        USDC: 0
      };

      // Process native SOL balance
      if (data.nativeBalance) {
        newBalances.SOL = parseFloat(data.nativeBalance.solana);
      }

      // Process token balances
      if (data.tokens && Array.isArray(data.tokens)) {
        data.tokens.forEach((token: any) => {
          const address = token.mint;
          // Use amountRaw for more precise balance calculation
          const balance = parseFloat(token.amountRaw) / Math.pow(10, token.decimals);
          
          // Check if it's USDC
          if (address === jupiterClient.TOKENS.USDC) {
            newBalances.USDC = balance;
          } else {
            // Store custom token balance
            newBalances[address] = balance;
          }

          // Update token info if it's a custom token
          if (!customTokens[address] && address !== jupiterClient.TOKENS.USDC) {
            setCustomTokens(prev => ({
              ...prev,
              [address]: {
                symbol: token.symbol || 'CUSTOM',
                decimals: token.decimals || 9,
                name: token.name || 'Custom Token',
                address: address
              }
            }));
          }
        });
      }

      console.log('Processed balances:', newBalances);
      setTokenBalances(newBalances);
    } catch (err) {
      console.error('Error fetching token balances:', err);
    }
  };

  // Handle custom token selection
  const handleCustomTokenSelect = async (address: string, isInput: boolean) => {
    try {
      // Validate the address format
      if (!address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
        throw new Error('Invalid token address format');
      }

      // Fetch token metadata from Moralis
      const metadataResponse = await fetch(
        `https://solana-gateway.moralis.io/token/mainnet/${address}/metadata`,
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

      // Store token info
      const tokenInfo = {
        symbol: metadata.symbol || 'CUSTOM',
        decimals: parseInt(metadata.decimals) || 9,
        name: metadata.name || 'Custom Token',
        address: address
      };

      setCustomTokens(prev => ({
        ...prev,
        [address]: tokenInfo
      }));

      // Set the selected token
      if (isInput) {
        setSelectedInputToken(address);
        setShowInputTokenModal(false);
      } else {
        setSelectedOutputToken(address);
        setShowOutputTokenModal(false);
      }

      // Refresh balances to include the new token
      await fetchTokenBalances();

    } catch (err) {
      console.error('Error in handleCustomTokenSelect:', err);
      setError(err instanceof Error ? err.message : 'Invalid token address');
    }
  };

  // Modified TokenSelector component
  const TokenSelector = ({ 
    isOpen, 
    onClose, 
    isInput, 
    onSelect, 
    customAddress, 
    setCustomAddress 
  }: { 
    isOpen: boolean, 
    onClose: () => void, 
    isInput: boolean,
    onSelect: (token: string) => void,
    customAddress: string,
    setCustomAddress: (address: string) => void
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="glass bg-black rounded-xl p-6 w-full max-w-md relative">
          <h3 className="text-xl font-bold mb-4">Select Token</h3>
          
          <div className="space-y-4">
            {/* Common tokens */}
            <div className="grid grid-cols-2 gap-2">
              <button
                className="btn btn-outline"
                onClick={() => {
                  onSelect('SOL');
                  onClose();
                }}
              >
                SOL
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  onSelect('USDC');
                  onClose();
                }}
              >
                USDC
              </button>
            </div>

            {/* Custom tokens list */}
            {Object.entries(customTokens).length > 0 && (
              <div className="space-y-2">
                <label className="text-sm text-white/70">Added Tokens</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(customTokens).map(([address, info]) => (
                    <button
                      key={address}
                      className="btn btn-outline"
                      onClick={() => {
                        onSelect(address);
                        onClose();
                      }}
                    >
                      {info.symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom token input */}
            <div className="space-y-2">
              <label className="text-sm text-white/70">Custom Token Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="Enter token contract address"
                  className="input input-bordered bg-black/20 text-white w-full focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (customAddress) {
                      handleCustomTokenSelect(customAddress, isInput);
                    }
                  }}
                  disabled={!customAddress}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Function to get token display name
  const getTokenDisplay = (address: string) => {
    if (address === 'SOL') return 'SOL';
    if (address === 'USDC') return 'USDC';
    return customTokens[address]?.symbol || 'UNKNOWN';
  };

  // Function to get token balance with proper decimals
  const getTokenBalance = (address: string) => {
    if (address === 'SOL') return tokenBalances.SOL.toFixed(4);
    if (address === 'USDC') return tokenBalances.USDC.toFixed(2);
    const balance = tokenBalances[address] || 0;
    const decimals = customTokens[address]?.decimals || 6;
    return balance.toFixed(Math.min(decimals, 6));
  };

  const fetchQuote = async () => {
    if (!inputAmount || isNaN(Number(inputAmount)) || Number(inputAmount) <= 0) {
      setOutputAmount('');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);

      // Get the correct token addresses
      const inputTokenAddress = selectedInputToken === 'SOL' 
        ? jupiterClient.TOKENS.SOL 
        : selectedInputToken === 'USDC' 
          ? jupiterClient.TOKENS.USDC 
          : selectedInputToken;

      const outputTokenAddress = selectedOutputToken === 'SOL' 
        ? jupiterClient.TOKENS.SOL 
        : selectedOutputToken === 'USDC' 
          ? jupiterClient.TOKENS.USDC 
          : selectedOutputToken;

      // Get decimals for amount calculation
      const inputTokenDecimals = selectedInputToken === 'SOL' 
        ? 9 
        : selectedInputToken === 'USDC' 
          ? 6 
          : customTokens[selectedInputToken]?.decimals || 9;

      const outputTokenDecimals = selectedOutputToken === 'SOL' 
        ? 9 
        : selectedOutputToken === 'USDC' 
          ? 6 
          : customTokens[selectedOutputToken]?.decimals || 9;

      // Convert input amount to proper format
      const amount = Math.floor(Number(inputAmount) * Math.pow(10, inputTokenDecimals));

      if (amount <= 0) {
        throw new Error('Invalid amount');
      }

      // Log the quote request parameters
      console.log('Quote request:', {
        inputMint: inputTokenAddress,
        outputMint: outputTokenAddress,
        amount,
        inputTokenDecimals,
        outputTokenDecimals,
        selectedInputToken,
        selectedOutputToken,
        customTokens
      });

      const quote = await jupiterClient.getQuote({
        inputMint: inputTokenAddress,
        outputMint: outputTokenAddress,
        amount: amount,
        slippageBps: Math.floor(slippage * 100)
      });

      // Log the quote response
      console.log('Quote response:', quote);

      // Convert output amount back to decimal format
      const formattedOutput = (Number(quote.outAmount) / Math.pow(10, outputTokenDecimals)).toFixed(outputTokenDecimals);
      setOutputAmount(formattedOutput);
      
      return quote;
    } catch (err) {
      console.error('Quote error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quote');
      setOutputAmount('');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch token balances from Moralis
  const fetchMoralisBalances = async (): Promise<TokenBalances> => {
    if (!publicKey) return { SOL: 0, USDC: 0 };

    try {
      const response = await fetch(
        `https://solana-gateway.moralis.io/account/mainnet/${publicKey}/portfolio?nftMetadata=true`,
        {
          headers: {
            'accept': 'application/json',
            'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImVjYzAxZDliLTdjYWItNDgzYy1hZDUzLTY4ZGMxMTkwZjZjNCIsIm9yZ0lkIjoiNDkyMTEiLCJ1c2VySWQiOiI0ODg3NiIsInR5cGVJZCI6IjUwMTgwNWE5LTVkNWEtNDI3OC1hMjE4LWIxNGFhYTU0OTljMCIsInR5cGUiOiJQUk9KRUNUIiwiaWF0IjoxNzQ0NTYzODI2LCJleHAiOjQ5MDAzMjM4MjZ9.XxbCVueyjps5wYAkl8AwuywxhBcw1xkieimSI_yOtfA'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch balances');
      }

      const data = await response.json();
      const balances: TokenBalances = {
        SOL: 0,
        USDC: 0
      };

      // Process native SOL balance
      if (data.nativeBalance) {
        balances.SOL = parseFloat(data.nativeBalance.solana);
      }

      // Process token balances
      if (data.tokens && Array.isArray(data.tokens)) {
        data.tokens.forEach((token: any) => {
          const address = token.mint;
          const balance = parseFloat(token.amountRaw) / Math.pow(10, token.decimals);
          
          if (address === jupiterClient.TOKENS.USDC) {
            balances.USDC = balance;
          } else {
            balances[address] = balance;
          }
        });
      }

      return balances;
    } catch (err) {
      console.error('Error fetching Moralis balances:', err);
      return { SOL: 0, USDC: 0 };
    }
  };

  // Function to check if balances have changed with retries
  const checkBalanceChangesWithRetry = async (maxRetries = 10): Promise<boolean> => {
    if (!preSwapBalances) return false;

    let retries = 0;
    let balanceChanged = false;

    while (!balanceChanged && retries < maxRetries) {
      try {
        const postSwapBalances = await fetchMoralisBalances();
        console.log(`Attempt ${retries + 1} - Pre-swap balances:`, preSwapBalances);
        console.log(`Attempt ${retries + 1} - Post-swap balances:`, postSwapBalances);

        // Get token addresses
        const inputToken = selectedInputToken === 'SOL' ? 'SOL' : selectedInputToken;
        const outputToken = selectedOutputToken === 'SOL' ? 'SOL' : selectedOutputToken;

        // Check if input token balance has decreased
        const inputBalanceChanged = postSwapBalances[inputToken] < preSwapBalances[inputToken];
        
        // Check if output token balance has increased
        const outputBalanceChanged = postSwapBalances[outputToken] > preSwapBalances[outputToken];

        console.log(`Attempt ${retries + 1} - Balance changes:`, {
          inputToken,
          outputToken,
          inputBalanceChanged,
          outputBalanceChanged,
          inputDiff: postSwapBalances[inputToken] - preSwapBalances[inputToken],
          outputDiff: postSwapBalances[outputToken] - preSwapBalances[outputToken]
        });

        if (inputBalanceChanged && outputBalanceChanged) {
          balanceChanged = true;
          break;
        }

        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000));
        retries++;
      } catch (err) {
        console.error(`Error checking balances on attempt ${retries + 1}:`, err);
        await new Promise(resolve => setTimeout(resolve, 2000));
        retries++;
      }
    }

    return balanceChanged;
  };

  const handleSwap = async () => {
    if (!wallet || !publicKey) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Get balances before swap
      const initialBalances = await fetchMoralisBalances();
      setPreSwapBalances(initialBalances);
      console.log('Initial balances recorded:', initialBalances);
      
      const quote = await fetchQuote();
      if (!quote) return;

      const swapResult = await jupiterClient.getSwapInstructions(quote, publicKey);
      
      // Execute the swap transaction
      const { swapTransaction } = swapResult;
      if (!swapTransaction || !wallet.signTransaction) {
        throw new Error('Failed to create swap transaction');
      }

      // Parse the transaction
      let transaction: Transaction | VersionedTransaction;
      try {
        transaction = Transaction.from(Buffer.from(swapTransaction, 'base64'));
      } catch (err) {
        throw new Error('Failed to parse swap transaction');
      }

      // Sign and send the transaction
      const signedTx = await wallet.signTransaction(transaction);
      const signature = await wallet.sendTransaction(signedTx, connection);
      
      // Show confirming state
      setIsConfirming(true);
      
      // Wait for confirmation with retries
      let confirmed = false;
      let attempts = 0;
      const maxAttempts = 15; // 30 seconds total (2s * 15)
      
      while (!confirmed && attempts < maxAttempts) {
        try {
          const confirmation = await connection.confirmTransaction(signature, 'confirmed');
          if (!confirmation.value.err) {
            confirmed = true;
            break;
          }
        } catch (err) {
          console.log(`Confirmation attempt ${attempts + 1} failed, retrying...`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
      }

      if (!confirmed) {
        // Check if transaction exists on chain
        const tx = await connection.getTransaction(signature, {
          commitment: 'confirmed',
          maxSupportedTransactionVersion: 0
        });

        if (tx) {
          // Transaction exists on chain, check balances
          let balanceChanged = false;
          let balanceAttempts = 0;
          const maxBalanceAttempts = 10;

          while (!balanceChanged && balanceAttempts < maxBalanceAttempts) {
            balanceChanged = await checkBalanceChangesWithRetry();
            if (!balanceChanged) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              balanceAttempts++;
            }
          }

          if (balanceChanged) {
            // Show success message
            const inputToken = getTokenDisplay(selectedInputToken);
            const outputToken = getTokenDisplay(selectedOutputToken);
            const successMsg = `✅ Swapped ${parseFloat(inputAmount).toFixed(4)} ${inputToken} → ${parseFloat(outputAmount).toFixed(4)} ${outputToken}`;
            console.log('Swap successful:', successMsg);
            setSuccessMessage(successMsg);
            setShowSuccessModal(true);
          } else {
            throw new Error('Transaction confirmed but balance changes not detected');
          }
        } else {
          throw new Error(`Transaction not found on chain. Check signature ${signature} using Solana Explorer`);
        }
      } else {
        // Transaction was confirmed, check balance changes
        let balanceChanged = false;
        let balanceAttempts = 0;
        const maxBalanceAttempts = 10;

        while (!balanceChanged && balanceAttempts < maxBalanceAttempts) {
          balanceChanged = await checkBalanceChangesWithRetry();
          if (!balanceChanged) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            balanceAttempts++;
          }
        }

        if (balanceChanged) {
          // Show success message
          const inputToken = getTokenDisplay(selectedInputToken);
          const outputToken = getTokenDisplay(selectedOutputToken);
          const successMsg = `✅ Swapped ${parseFloat(inputAmount).toFixed(4)} ${inputToken} → ${parseFloat(outputAmount).toFixed(4)} ${outputToken}`;
          console.log('Swap successful:', successMsg);
          setSuccessMessage(successMsg);
          setShowSuccessModal(true);
        } else {
          throw new Error('Transaction confirmed but balance changes not detected');
        }
      }

      // Clear input/output amounts after successful swap
      setInputAmount('');
      setOutputAmount('');
      
      // Fetch updated balances after swap
      await Promise.all([fetchBalance(), fetchTokenBalances()]);
      
    } catch (err) {
      console.error('Swap error:', err);
      setError(err instanceof Error ? err.message : 'Failed to execute swap');
    } finally {
      setIsLoading(false);
      setIsConfirming(false);
      setPreSwapBalances(null);
    }
  };

  useEffect(() => {
    if (inputAmount) {
      fetchQuote();
    }
  }, [inputAmount, selectedInputToken, selectedOutputToken, slippage]);

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  };

  const handleDisconnectWallet = async () => {
    setIsLoading(true);
    try {
      await disconnect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Add function to handle percentage input
  const handlePercentageInput = (percentage: number) => {
    if (!publicKey) return;
    
    const balance = getTokenBalance(selectedInputToken);
    const amount = (parseFloat(balance) * percentage).toString();
    setInputAmount(amount);
    setCustomPercentage('');
  };

  // Add function to handle custom percentage
  const handleCustomPercentage = () => {
    if (!publicKey || !customPercentage) return;
    
    const percentage = parseFloat(customPercentage) / 100;
    if (isNaN(percentage) || percentage < 0 || percentage > 1) {
      setError('Please enter a valid percentage between 0 and 100');
      return;
    }
    
    handlePercentageInput(percentage);
  };

  // Add fade-in animation
  const styles = `
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.2s ease-out;
    }
  `;

  // Success Modal Component
  const SuccessModal = () => {
    if (!showSuccessModal) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
        <div className="relative bg-[#1a1b1e] rounded-xl p-6 max-w-md w-full mx-4 border border-white/10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Swap Successful!</h3>
            <p className="text-lg mb-6">{successMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 bg-[#2a2b2e] hover:bg-[#3a3b3e] rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading Modal Component
  const LoadingModal = () => {
    if (!isConfirming) return null;

    // Add effect to handle the 20-second timer
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsConfirming(false);
        setShowSuccessModal(true);
        // Reload the page after showing success message
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, 20000);

      return () => clearTimeout(timer);
    }, [isConfirming]);

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-[#1a1b1e] rounded-xl p-6 max-w-md w-full mx-4 border border-white/10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <h3 className="text-xl font-bold mb-2">Confirming Transaction</h3>
            <p className="text-lg mb-6">Please wait while we confirm your swap...</p>
            <p className="text-sm text-white/70">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{styles}</style>
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

          <Link href="/app/calidatrade" className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center glow-primary relative group">
            <div className="absolute inset-0 rounded-full border border-primary/40 group-hover:border-primary/60 transition-colors"></div>
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

      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between backdrop-blur-sm bg-black/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center relative group">
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite] group-hover:border-primary/40 transition-colors"></div>
            <Image 
              src="/module-calida.svg" 
              alt="CalidaTrade" 
              width={24} 
              height={24}
            />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-primary/70 bg-clip-text text-transparent">CalidaTrade</h1>
        </div>
        <div className="flex items-center gap-4">
          {publicKey ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm text-white/70">
                  {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                </span>
                <span className="text-sm font-medium text-primary">
                  {balance !== null ? `${balance.toFixed(4)} SOL` : '...'}
                </span>
              </div>
              <button
                onClick={handleDisconnectWallet}
                className="btn btn-outline btn-sm"
                disabled={isLoading}
              >
                {isLoading ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-4 py-2 rounded-full text-sm font-medium shadow-glow transition-all duration-300 flex items-center gap-2"
              disabled={isLoading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-20 px-4 pb-8 max-w-4xl mx-auto">
        <div className="glass rounded-xl p-6 space-y-6">
          <h1 className="text-2xl font-bold">Swap Tokens</h1>
          
          {/* Slippage Settings */}
          <div className="space-y-2">
            <label className="text-sm text-white/70">Slippage Tolerance</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(Number(e.target.value))}
                className="input input-bordered bg-black/20 text-white w-full focus:outline-none focus:ring-1 focus:ring-primary"
                min="0.1"
                max="100"
                step="0.1"
              />
              <span className="text-sm">%</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSlippage(0.1)}
                  className={`btn btn-sm ${slippage === 0.1 ? 'btn-primary' : 'btn-outline'}`}
                >
                  0.1%
                </button>
                <button
                  onClick={() => setSlippage(0.5)}
                  className={`btn btn-sm ${slippage === 0.5 ? 'btn-primary' : 'btn-outline'}`}
                >
                  0.5%
                </button>
                <button
                  onClick={() => setSlippage(1.0)}
                  className={`btn btn-sm ${slippage === 1.0 ? 'btn-primary' : 'btn-outline'}`}
                >
                  1.0%
                </button>
              </div>
            </div>
          </div>

          {/* Input Token Section */}
          <div className="space-y-4 bg-[#1a1b1e] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-medium">Selling</div>
              {publicKey && (
                <div className="text-sm text-white/70">
                  Balance: {getTokenBalance(selectedInputToken)} {getTokenDisplay(selectedInputToken)}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-[#1e2023] p-2 rounded-xl min-w-[140px] cursor-pointer"
                   onClick={() => setShowInputTokenModal(true)}>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-lg">$</span>
                </div>
                <span className="text-lg font-medium">{getTokenDisplay(selectedInputToken)}</span>
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <input
                type="text"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-right text-4xl w-full outline-none"
              />
            </div>
            <div className="text-right text-gray-500">$0</div>
            
            {/* Percentage Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => handlePercentageInput(0.2)}
                className="px-3 py-1 bg-[#2a2b2e] hover:bg-[#3a3b3e] rounded-lg text-sm transition-colors"
              >
                20%
              </button>
              <button
                onClick={() => handlePercentageInput(0.5)}
                className="px-3 py-1 bg-[#2a2b2e] hover:bg-[#3a3b3e] rounded-lg text-sm transition-colors"
              >
                50%
              </button>
              <button
                onClick={() => handlePercentageInput(0.75)}
                className="px-3 py-1 bg-[#2a2b2e] hover:bg-[#3a3b3e] rounded-lg text-sm transition-colors"
              >
                75%
              </button>
              <button
                onClick={() => handlePercentageInput(1)}
                className="px-3 py-1 bg-[#2a2b2e] hover:bg-[#3a3b3e] rounded-lg text-sm transition-colors"
              >
                100%
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customPercentage}
                  onChange={(e) => setCustomPercentage(e.target.value)}
                  placeholder="Custom %"
                  className="w-20 px-2 py-1 bg-[#2a2b2e] rounded-lg text-sm outline-none"
                  min="0"
                  max="100"
                />
                <button
                  onClick={handleCustomPercentage}
                  className="px-3 py-1 bg-[#2a2b2e] hover:bg-[#3a3b3e] rounded-lg text-sm transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button 
              className="bg-[#1a1b1e] p-3 rounded-xl hover:bg-[#2a2b2e] transition-colors"
              onClick={() => {
                setSelectedInputToken(selectedOutputToken);
                setSelectedOutputToken(selectedInputToken);
                setInputAmount(outputAmount);
                setOutputAmount(inputAmount);
              }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* Output Token Section */}
          <div className="space-y-4 bg-[#1a1b1e] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-medium">Buying</div>
              {publicKey && (
                <div className="text-sm text-white/70">
                  Balance: {getTokenBalance(selectedOutputToken)} {getTokenDisplay(selectedOutputToken)}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-[#1e2023] p-2 rounded-xl min-w-[140px] cursor-pointer"
                   onClick={() => setShowOutputTokenModal(true)}>
                <div className="w-8 h-8 rounded-full bg-[#2a2b2e] flex items-center justify-center">
                  <span className="text-lg">S</span>
                </div>
                <span className="text-lg font-medium">{getTokenDisplay(selectedOutputToken)}</span>
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <input
                type="text"
                value={outputAmount}
                onChange={(e) => setOutputAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-right text-4xl w-full outline-none"
              />
            </div>
            <div className="text-right text-gray-500">$0</div>
          </div>

          {/* Connect Wallet Button */}
          <button
            onClick={handleSwap}
            disabled={isLoading || (!publicKey ? false : (!inputAmount || !outputAmount))}
            className="w-full bg-[#f15a22] hover:bg-[#f15a22]/90 text-white py-4 rounded-xl text-lg font-medium transition-colors"
          >
            {!publicKey ? 'Connect Wallet to Swap' : isLoading ? 'Swapping...' : 'Swap'}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
              {error}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <TokenSelector
        isOpen={showInputTokenModal}
        onClose={() => setShowInputTokenModal(false)}
        isInput={true}
        onSelect={setSelectedInputToken}
        customAddress={customInputAddress}
        setCustomAddress={setCustomInputAddress}
      />

      <TokenSelector
        isOpen={showOutputTokenModal}
        onClose={() => setShowOutputTokenModal(false)}
        isInput={false}
        onSelect={setSelectedOutputToken}
        customAddress={customOutputAddress}
        setCustomAddress={setCustomOutputAddress}
      />

      {/* Loading Modal */}
      <LoadingModal />
      
      {/* Success Modal */}
      <SuccessModal />
    </div>
  );
} 