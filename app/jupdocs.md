Overview
Jupiter, Solana's leading swap aggregator and routing protocol, is a powerful tool for developers looking to build trading tools, dApps, and other DeFi applications. In this guide, we will learn how to use Jupiter's v6 API and QuickNode's Metis add-on to create a simple Solana trading bot. This guide is designed for developers with a solid understanding of TypeScript and the Solana blockchain. Whether you're looking to enhance your portfolio, experiment with new trading strategies, or explore the capabilities of Solana and its DeFi applications, this guide has got you covered.
Prefer a video walkthrough? Follow along with Sahil and learn how to create a trading bot on Solana using Jupiter API.

Subscribe to our YouTube channel for more videos!
Subscribe
Note: This guide is for educational purposes only. QuickNode does not provide financial advice or endorse any trading strategies. Always do your own research and consult with a financial advisor before making any investment decisions.
What You Will Do
In this guide, you will:
Get an overview of Jupiter
Learn how to use Jupiter's v6 API
Create a class-based trading bot that swaps SOL for USDC using Jupiter's API. The bot will use the Jupiter API to monitor the market for specific conditions and execute Jupiter trades when met.
What You Will Need
Basic knowledge of Solana Fundamentals
Basic experience with Solana Versioned Transactions
Node.js (version 18.16 or higher) installed
Typescript and ts-node latest version installed
A Solana file system wallet with a SOL and USDC balance
ENHANCED PERFORMANCE WITH QUICKNODE
Reliable and high-performance blockchain infrastructure is critical to get the most out of your Solana trading bot. QuickNode provides fast and scalable Solana RPC node endpoints that significantly enhance your bot's responsiveness and efficiency. Sign Up for a free account and get started with QuickNode today.
In addition to a solid RPC endpoint, consider leveraging the QuickNode's Jupiter API plugin, Metis for optimized trade execution. This add-on allows you to make full use of Jupiter's V6 Swap API. Never worry about setting up or maintaining a server with our rolling restarts and low latency. Markets and pools show up immediately.
This add-on will not use your account credits as it depends on its own Solana validator node, segmented from our pro network for maximum reliability.
Alternatively, you can access a Public endpoint for Jupiter's API here: https://www.jupiterapi.com/.
What is Jupiter?
Jupiter is a Web3 Swap program on Solana. Jupiter allows users to find efficient routes for swapping tokens on Solana. Token swapping is a core feature of DeFi that enables users to trade one token for another while accounting for the market value of each token.
Jup.ag SwapSource: jup.ag
Jupiter aggregates pricing from many decentralized exchanges (DEXs) and automated market makers (AMMs) and employs a unique algorithm called "smart routing" that allows users to find the best price for their swap.
Jupiter RoutesSource: Jupiter Docs: How Does Jupiter Work
Jupiter will also search for inefficiencies in intermediary swaps (e.g., USDC-mSOL-SOL instead of USDC-SOL) to find lower costs for users. When executing swaps, Jupiter also utilizes a concept called Trade Splitting, which breaks a trade into smaller trades across multiple DEXs to find the best price.
Using Jupiter's v6 API
The Jupiter Swap API is a powerful tool for developers looking to build trading tools, dApps, and other DeFi applications. The API provides access to Jupiter's smart routing algorithm, allowing developers to find the best price for their swaps and create Solana transactions/instructions for executing the trade. The API includes five main methods:
Endpoint	JS Method Name(s)	Type	Description
/quote	quoteGet
quoteGetRaw	GET	Get best-priced quote for a swap given two tokens and a swap amount
/swap	swapPost
swapPostRaw	POST	Returns a Solana swap transaction from a quote
/swap-instructions	swapInstructionsPost
swapInstructionsPostRaw	POST	Returns Solana swap instructions from a quote
/program-id-to-label	programIdToLabelGet
programIdToLabelGetRaw	GET	Returns a mapping of names/labels for all program ID
/indexed-route-map	indexedRouteMapGet
indexedRouteMapGetRaw	GET	Returns a hash map, input mint as key and an array of valid output mint as values
Requests can be made with the following format: {server}/{endpoint}?{query/body}. Here's an example for getting a quote for a swap of 100 USDC to SOL with a cURL:
curl -L 'https://jupiter-swap-api.quiknode.pro/YOUR_ENDPOINT/quote?inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&outputMint=So11111111111111111111111111111111111111112&amount=100000000' \
-H 'Accept: application/json'


Make sure to replace https://jupiter-swap-api.quiknode.pro/YOUR_ENDPOINT with our own Metis endpoint (Alternatively, you can our public endpoint: https://public.jupiterapi.com - though some methods may not be available). You can find your Metis address from your QuickNode Dashboard's add-on page (https://dashboard.quicknode.com/endpoints/YOUR_ENDPOINT/add-ons):
Metis Address
To use the Jupiter JS Client, you can install it via npm:
npm install @jup-ag/api

You will need to create an instance of the Jupiter API client and pass in your Metis key (e.g., https://jupiter-swap-api.quiknode.pro/YOUR_ENDPOINT) or a public endpoint available here :
import { createJupiterApiClient } from '@jup-ag/api';

const ENDPOINT = `https://jupiter-swap-api.quiknode.pro/XX123456`; // 👈 Replace with your Metis Key or a public one https://www.jupiterapi.com/
const CONFIG = {
    basePath: ENDPOINT
};
const jupiterApi = createJupiterApiClient(CONFIG);


LOGS FOR SIMPLIFIED DEBUGGING
You can now access Logs for your RPC endpoints, helping you troubleshoot issues more effectively. If you encounter an issue with your RPC calls, simply check the logs in your QuickNode dashboard to identify and resolve problems quickly. Learn more about log history limits on our pricing page.
And then call the methods you need, for example:
    jupiterApi.quoteGet({
        inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        outputMint: "So11111111111111111111111111111111111111112",
        amount: 100_000_000,
    }).then((quote) => {
        console.log(quote.outAmount, quote.outputMint);
    }).catch((error) => {
        console.error(error);
    });

All methods and documentation can be found at [Jupiter Station]:
OpenAPI and
Docs
Let's test it out by creating a simple trading bot that uses Jupiter's API to monitor the market for specific conditions and execute trades when they are met.
Trading Bot

BEFORE YOU START
This example is for educational purposes. Do not use this code in a production environment. Trades executed on Solana's mainnet are irreversible and can result in financial loss. Always do your own research and consult with a financial advisor before making any investment decisions.
Here's what our bot is going to do:
The bot will expect a wallet with a SOL and USDC balance.
The bot will monitor the market (using Jupiter's get quote method on a specified interval).
The bot will execute a trade using Jupiter's swap method when the market price meets our defined conditions.
The bot will log our swap if it is successful and update the next trade conditions so the bot will execute its next swap at a predefined % change from the previous swap.
The bot will run until we terminate it or insufficient SOL is available to execute the next trade.
Set Up Your Project
First, let's create a new project directory:
mkdir jupiter-trading-bot
cd jupiter-trading-bot

Then, initialize a new Node.js project:
npm init -y

Next, install your dependencies. We will need the Jupiter API, Solana Web3.js, Solana SPL Token Program, and dotenv:
npm install @jup-ag/api @solana/web3.js@1 dotenv @solana/spl-token

Create three files in your project directory: bot.ts, index.ts, and .env:
echo > bot.ts && echo > index.ts && echo > .env

Define .env Variables
Open the .env file and add the following variables:
# Replace with your Your Solana wallet secret key
SECRET_KEY=[00, 00, ... 00]
# Replace with your QuickNode Solana Mainnet RPC endpoint
SOLANA_ENDPOINT=https://example.solana-mainnet.quiknode.pro/123456/
# Replace with your QuickNode Jupiter API endpoint (or a public one: https://www.jupiterapi.com/)
METIS_ENDPOINT=https://jupiter-swap-api.quiknode.pro/123456


Make sure to replace the variables with your own. If you do not have have a file system wallet, you can create one by running:
solana-keygen new --no-bip39-passphrase --silent --outfile ./my-keypair.json 

Import Dependencies
Open bot.ts and import the necessary dependencies:
import { Keypair, Connection, PublicKey, VersionedTransaction, LAMPORTS_PER_SOL, TransactionInstruction, AddressLookupTableAccount, TransactionMessage, TransactionSignature, TransactionConfirmationStatus, SignatureStatus } from "@solana/web3.js";
import { createJupiterApiClient, DefaultApi, ResponseError, QuoteGetRequest, QuoteResponse, Instruction, AccountMeta } from '@jup-ag/api';
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import * as fs from 'fs';
import * as path from 'path';


Define Interfaces
Let's create a couple of interfaces to define the bot's configuration and the trade conditions:
interface ArbBotConfig {
    solanaEndpoint: string; // e.g., "https://ex-am-ple.solana-mainnet.quiknode.pro/123456/"
    metisEndpoint: string;  // e.g., "https://jupiter-swap-api.quiknode.pro/123456/"
    secretKey: Uint8Array;
    firstTradePrice: number; // e.g. 94 USDC/SOL
    targetGainPercentage?: number;
    checkInterval?: number;
    initialInputToken: SwapToken;
    initialInputAmount: number;
}

interface NextTrade extends QuoteGetRequest {
    nextTradeThreshold: number;
}

export enum SwapToken {
    SOL,
    USDC
}

interface LogSwapArgs {
    inputToken: string;
    inAmount: string;
    outputToken: string;
    outAmount: string;
    txId: string;
    timestamp: string;
}



ArbBotConfig will be used to define the bot's configuration, including the Solana and Jupiter API endpoints, the secret key, the initial trade price, the target gain percentage, the check interval, and the initial input token and amount.
NextTrade will be used to define the next trade's conditions, including the input and output tokens, the amount, and the threshold.
LogSwapArgs will be used to log the details of each trade to a json file.
Define Bot Class
Let's frame an ArbBot class that will handle the bot's logic. We will predefine the class and its methods and then fill in the details in the next section. We will also populate a few helper methods so we can save time on those. Add the following to bot.ts:
export class ArbBot {
    private solanaConnection: Connection;
    private jupiterApi: DefaultApi;
    private wallet: Keypair;
    private usdcMint: PublicKey = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    private solMint: PublicKey = new PublicKey("So11111111111111111111111111111111111111112");
    private usdcTokenAccount: PublicKey;
    private solBalance: number = 0;
    private usdcBalance: number = 0;
    private checkInterval: number = 1000 * 10; 
    private lastCheck: number = 0;
    private priceWatchIntervalId?: NodeJS.Timeout;
    private targetGainPercentage: number = 1;
    private nextTrade: NextTrade;
    private waitingForConfirmation: boolean = false;

    constructor(config: ArbBotConfig) {
        // TODO
    }

    async init(): Promise<void> {
        console.log(`🤖 Initiating arb bot for wallet: ${this.wallet.publicKey.toBase58()}.`)
        await this.refreshBalances();
        console.log(`🏦 Current balances:\nSOL: ${this.solBalance / LAMPORTS_PER_SOL},\nUSDC: ${this.usdcBalance}`);
        this.initiatePriceWatch();
    }

    private async refreshBalances(): Promise<void> {
        // TODO
    }


    private initiatePriceWatch(): void {
        // TODO
    }

    private async getQuote(quoteRequest: QuoteGetRequest): Promise<QuoteResponse> {
        // TODO
    }

    private async evaluateQuoteAndSwap(quote: QuoteResponse): Promise<void> {
        // TODO
    }

    private async confirmTransaction(
        connection: Connection,
        signature: TransactionSignature,
        desiredConfirmationStatus: TransactionConfirmationStatus = 'confirmed',
        timeout: number = 30000,
        pollInterval: number = 1000,
        searchTransactionHistory: boolean = false
    ): Promise<SignatureStatus> {
        // TODO
    }

    private async executeSwap(route: QuoteResponse): Promise<void> {
        // TODO
    }

    private async updateNextTrade(lastTrade: QuoteResponse): Promise<void> {
        // TODO
    }

    private async logSwap(args: LogSwapArgs): Promise<void> {
        const { inputToken, inAmount, outputToken, outAmount, txId, timestamp } = args;
        const logEntry = {
            inputToken,
            inAmount,
            outputToken,
            outAmount,
            txId,
            timestamp,
        };

        const filePath = path.join(__dirname, 'trades.json');

        try {
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify([logEntry], null, 2), 'utf-8');
            } else {
                const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
                const trades = JSON.parse(data);
                trades.push(logEntry);
                fs.writeFileSync(filePath, JSON.stringify(trades, null, 2), 'utf-8');
            }
            console.log(`✅ Logged swap: ${inAmount} ${inputToken} -> ${outAmount} ${outputToken},\n  TX: ${txId}}`);
        } catch (error) {
            console.error('Error logging swap:', error);
        }
    }

    private terminateSession(reason: string): void {
        console.warn(`❌ Terminating bot...${reason}`);
        console.log(`Current balances:\nSOL: ${this.solBalance / LAMPORTS_PER_SOL},\nUSDC: ${this.usdcBalance}`);
        if (this.priceWatchIntervalId) {
            clearInterval(this.priceWatchIntervalId);
            this.priceWatchIntervalId = undefined; // Clear the reference to the interval
        }
        setTimeout(() => {
            console.log('Bot has been terminated.');
            process.exit(1);
        }, 1000);
    }

    private instructionDataToTransactionInstruction (
        instruction: Instruction | undefined
    ) {
        if (instruction === null || instruction === undefined) return null;
        return new TransactionInstruction({
            programId: new PublicKey(instruction.programId),
            keys: instruction.accounts.map((key: AccountMeta) => ({
                pubkey: new PublicKey(key.pubkey),
                isSigner: key.isSigner,
                isWritable: key.isWritable,
            })),
            data: Buffer.from(instruction.data, "base64"),
        });
    };

    private async getAdressLookupTableAccounts (
        keys: string[], connection: Connection
    ): Promise<AddressLookupTableAccount[]> {
        const addressLookupTableAccountInfos =
            await connection.getMultipleAccountsInfo(
                keys.map((key) => new PublicKey(key))
            );
    
        return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
            const addressLookupTableAddress = keys[index];
            if (accountInfo) {
                const addressLookupTableAccount = new AddressLookupTableAccount({
                    key: new PublicKey(addressLookupTableAddress),
                    state: AddressLookupTableAccount.deserialize(accountInfo.data),
                });
                acc.push(addressLookupTableAccount);
            }
    
            return acc;
        }, new Array<AddressLookupTableAccount>());
    };

    private async postTransactionProcessing(quote: QuoteResponse, txid: string): Promise<void> {
        const { inputMint, inAmount, outputMint, outAmount } = quote;
        await this.updateNextTrade(quote);
        await this.refreshBalances();
        await this.logSwap({ inputToken: inputMint, inAmount, outputToken: outputMint, outAmount, txId: txid, timestamp: new Date().toISOString() });
    }
}


Before moving on, let's walk through what we have here:
First, we define a few class properties, including the Solana connection, the Jupiter API, the wallet, the USDC and SOL mints, the USDC token account, the check interval, the last check, the price watch interval id, the target gain percentage, the next trade, and a flag to indicate if the bot is waiting for confirmation. We will use these to track the bot's state and manage the trading logic.
We define a constructor that takes a configuration object and initializes the bot's properties. We also define an init method that will be used to start the bot and fetch the initial balances.
We are defining a few helper methods:
logSwap will be used to log the details of each trade to a json file.
terminateSession will be used to terminate the bot and log the reason for termination.
instructionDataToTransactionInstruction will convert an instruction into a transaction instruction.
getAdressLookupTableAccounts will be used to fetch address lookup table accounts.
postTransactionProcessing will trigger necessary steps after a successful swap (updateNextTrade, refreshBalances, and logSwap). We will define those methods in the next section.
Constructor
Let's build our constructor to initiate an instance of ArbBot. We have already defined our ArbBotConfig interface, so we can use that to define the constructor's parameters. Add the following to bot.ts:
    constructor(config: ArbBotConfig) {
        const { 
            solanaEndpoint, 
            metisEndpoint, 
            secretKey, 
            targetGainPercentage,
            checkInterval,
            initialInputToken,
            initialInputAmount,
            firstTradePrice
        } = config;
        this.solanaConnection = new Connection(solanaEndpoint);
        this.jupiterApi = createJupiterApiClient({ basePath: metisEndpoint });
        this.wallet = Keypair.fromSecretKey(secretKey);
        this.usdcTokenAccount = getAssociatedTokenAddressSync(this.usdcMint, this.wallet.publicKey);
        if (targetGainPercentage) { this.targetGainPercentage = targetGainPercentage }
        if (checkInterval) { this.checkInterval = checkInterval }
        this.nextTrade = {
            inputMint: initialInputToken === SwapToken.SOL ? this.solMint.toBase58() : this.usdcMint.toBase58(),
            outputMint: initialInputToken === SwapToken.SOL ? this.usdcMint.toBase58() : this.solMint.toBase58(),
            amount: initialInputAmount,
            nextTradeThreshold: firstTradePrice,
        };
    }



First, we destructure the configuration object and assign the properties to the class instance.
We then use their respective endpoints to create a new Solana connection and Jupiter API client.
We also define a new wallet instance from the secret key.
We then fetch the USDC token account associated with the wallet.
We set the target gain percentage and check interval if they are provided (recall we have included default values for these in the class).
Finally, we set the next trade conditions based on the initial input token (and amount) and the first trade price. The direction of the trade depends on which token is passed into the initial input token configuration argument.
We have already defined a public .init() method. This method can be used in conjunction with the constructor to initialize the bot and start the price watch interval. Here's an example of how that might look in our client:
    const bot = new ArbBot({
        solanaEndpoint: process.env.SOLANA_ENDPOINT ?? defaultConfig.solanaEndpoint,
        metisEndpoint: process.env.METIS_ENDPOINT ?? defaultConfig.jupiter,
        secretKey: decodedSecretKey,
        firstTradePrice: 0.1036 * LAMPORTS_PER_SOL,
        targetGainPercentage: 0.15,
        initialInputToken: SwapToken.USDC,
        initialInputAmount: 10_000_000,
    });

    await bot.init();


Let's define the refreshBalances and initiatePriceWatch methods that we call in the constructor's init method.
Refresh Balances
The refreshBalances method will be used to fetch the current SOL and USDC balances of the bot's wallet. Add the following to bot.ts:
    private async refreshBalances(): Promise<void> {
        try {
            const results = await Promise.allSettled([
                this.solanaConnection.getBalance(this.wallet.publicKey),
                this.solanaConnection.getTokenAccountBalance(this.usdcTokenAccount)
            ]);

            const solBalanceResult = results[0];
            const usdcBalanceResult = results[1];

            if (solBalanceResult.status === 'fulfilled') {
                this.solBalance = solBalanceResult.value;
            } else {
                console.error('Error fetching SOL balance:', solBalanceResult.reason);
            }

            if (usdcBalanceResult.status === 'fulfilled') {
                this.usdcBalance = usdcBalanceResult.value.value.uiAmount ?? 0;
            } else {
                this.usdcBalance = 0;
            }

            if (this.solBalance < LAMPORTS_PER_SOL / 100) {
                this.terminateSession("Low SOL balance.");
            }
        } catch (error) {
            console.error('Unexpected error during balance refresh:', error);
        }
    }


Here's what we're doing:
Using Promise.allSettled to fetch the SOL and USDC balances in parallel, using the getBalance and getTokenAccountBalance methods of the Solana connection.
We then update the bot's SOL and USDC balances based on the results if they are successful, otherwise we log the error.
We also check if the SOL balance is less than 0.01 SOL and terminate the bot if it is.
Initiate Price Watch
The initiatePriceWatch method will be used to start the price watch interval. Add the following to bot.ts:
    private initiatePriceWatch(): void {
        this.priceWatchIntervalId = setInterval(async () => {
            const currentTime = Date.now();
            if (currentTime - this.lastCheck >= this.checkInterval) {
                this.lastCheck = currentTime;
                try {
                    if (this.waitingForConfirmation) {
                        console.log('Waiting for previous transaction to confirm...');
                        return;
                    }
                    const quote = await this.getQuote(this.nextTrade);
                    this.evaluateQuoteAndSwap(quote);
                } catch (error) {
                    console.error('Error getting quote:', error);
                }
            }
        }, this.checkInterval);
    }


This is just a simple interval that will call the getQuote method and then the evaluateQuoteAndSwap method if:
The time since the last check is greater than the check interval and
The bot is not waiting for confirmation before proceeding (we will include toggles for this in the executeSwap and postTransactionProcessing methods to ensure the bot does not attempt to execute a trade while waiting for confirmation).
Let's define the getQuote, evaluateQuoteAndSwap, and executeSwap methods next.
Get Quote
To get a quote, we will rely on Jupiter's quoteGet method. Add the following to bot.ts:
    private async getQuote(quoteRequest: QuoteGetRequest): Promise<QuoteResponse> {
        try {
            const quote: QuoteResponse | null = await this.jupiterApi.quoteGet(quoteRequest);
            if (!quote) {
                throw new Error('No quote found');
            }
            return quote;
        } catch (error) {
            if (error instanceof ResponseError) {
                console.log(await error.response.json());
            }
            else {
                console.error(error);
            }
            throw new Error('Unable to find quote');
        }
    }


This should look familiar to our example in the overview sections. We are simply passing the quote request to the quoteGet method and returning the quote if it exists, otherwise we log the error and throw a new error. If you refer back to initiatePriceWatch, you can see that we will pass this.nextTrade to this method. Our NextTrade interface extends the QuoteGetRequest interface, so we can pass it directly to the quoteGet method 🙌.
Evaluate Quote and Swap
We need a way to ensure a quote meets our conditions before executing a trade. We will define the evaluateQuoteAndSwap method to handle this. Add the following to bot.ts:
    private async evaluateQuoteAndSwap(quote: QuoteResponse): Promise<void> {
        let difference = (parseInt(quote.outAmount) - this.nextTrade.nextTradeThreshold) / this.nextTrade.nextTradeThreshold;
        console.log(`📈 Current price: ${quote.outAmount} is ${difference > 0 ? 'higher' : 'lower'
            } than the next trade threshold: ${this.nextTrade.nextTradeThreshold} by ${Math.abs(difference * 100).toFixed(2)}%.`);
        if (parseInt(quote.outAmount) > this.nextTrade.nextTradeThreshold) {
            try {
                this.waitingForConfirmation = true;
                await this.executeSwap(quote);
            } catch (error) {
                console.error('Error executing swap:', error);
            }
        }
    }


Our evaluateQuoteAndSwap method will accept the response from the quoteGet method and then calculate the difference between the quote's output amount and the next trade threshold. If the difference is positive, we will execute the swap. We will also set the waitingForConfirmation flag to true to prevent the bot from attempting to execute another trade while waiting for confirmation. For debugging/demonstration, we will also log the current price and the difference between the current price and the next trade threshold.
Confirm Transaction
We need a way to ensure a trade is confirmed before proceeding. We will define the confirmTransaction method to handle this. Add the following to bot.ts:
    private async confirmTransaction(
        connection: Connection,
        signature: TransactionSignature,
        desiredConfirmationStatus: TransactionConfirmationStatus = 'confirmed',
        timeout: number = 30000,
        pollInterval: number = 1000,
        searchTransactionHistory: boolean = false
    ): Promise<SignatureStatus> {
        const start = Date.now();

        while (Date.now() - start < timeout) {
            const { value: statuses } = await connection.getSignatureStatuses([signature], { searchTransactionHistory });

            if (!statuses || statuses.length === 0) {
                throw new Error('Failed to get signature status');
            }

            const status = statuses[0];

            if (status === null) {
                await new Promise(resolve => setTimeout(resolve, pollInterval));
                continue;
            }

            if (status.err) {
                throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`);
            }

            if (status.confirmationStatus && status.confirmationStatus === desiredConfirmationStatus) {
                return status;
            }

            if (status.confirmationStatus === 'finalized') {
                return status;
            }

            await new Promise(resolve => setTimeout(resolve, pollInterval));
        }

        throw new Error(`Transaction confirmation timeout after ${timeout}ms`);
    };


This method will poll the Solana network for the transaction status until it is either confirmed or the timeout is reached. We have included some default values for the timeout and poll interval, but you can adjust them as needed.
Execute Swap
Finally, if our bot detects that market conditions are appropriate to satisfy our trade requirements, we should execute the trade. We are going to pack a lot into this method:
Fetch the swap instructions from Jupiter's API
Refactor our received instruction data to transaction instructions
Fetch the address lookup table accounts
Create and send a Solana Transaction
On success, log the swap and update the next trade conditions
Let's add our code, and then we will break it down:
    private async executeSwap(route: QuoteResponse): Promise<void> {
        try {
            const {
                computeBudgetInstructions,
                setupInstructions,
                swapInstruction,
                cleanupInstruction,
                addressLookupTableAddresses,
            } = await this.jupiterApi.swapInstructionsPost({
                swapRequest: {
                    quoteResponse: route,
                    userPublicKey: this.wallet.publicKey.toBase58(),
                    prioritizationFeeLamports: 'auto'
                },
            });

            const instructions: TransactionInstruction[] = [
                ...computeBudgetInstructions.map(this.instructionDataToTransactionInstruction),
                ...setupInstructions.map(this.instructionDataToTransactionInstruction),
                this.instructionDataToTransactionInstruction(swapInstruction),
                this.instructionDataToTransactionInstruction(cleanupInstruction),
            ].filter((ix) => ix !== null) as TransactionInstruction[];

            const addressLookupTableAccounts = await this.getAdressLookupTableAccounts(
                addressLookupTableAddresses,
                this.solanaConnection
            );

            const { blockhash, lastValidBlockHeight } = await this.solanaConnection.getLatestBlockhash();

            const messageV0 = new TransactionMessage({
                payerKey: this.wallet.publicKey,
                recentBlockhash: blockhash,
                instructions,
            }).compileToV0Message(addressLookupTableAccounts);

            const transaction = new VersionedTransaction(messageV0);
            transaction.sign([this.wallet]);

            const rawTransaction = transaction.serialize();
            const txid = await this.solanaConnection.sendRawTransaction(rawTransaction, {
                skipPreflight: true,
                maxRetries: 2
            });
            const confirmation = await this.confirmTransaction(this.solanaConnection, txid);
            if (confirmation.err) {
                throw new Error('Transaction failed');
            }            
            await this.postTransactionProcessing(route, txid);
        } catch (error) {
            if (error instanceof ResponseError) {
                console.log(await error.response.json());
            }
            else {
                console.error(error);
            }
            throw new Error('Unable to execute swap');
        } finally {
            this.waitingForConfirmation = false;
        }
    }



First, we are fetching the swap instructions from Jupiter's API by calling this.jupiterApi.swapInstructionsPost. We are passing in the quote received from the getQuote method, our wallet's public key (necessary to build a user-specific instruction set), and a prioritization fee (we are setting this to 'auto' to let Jupiter determine the fee). You can explore additional optional arguments by checking the Jupiter API Docs.
We then refactor the received instruction data to transaction instructions using the instructionDataToTransactionInstruction method we defined earlier. The main reason for this is to remove potentially null or undefined instructions from the array and ensure we have a clean, flat array of instructions to pass to the Solana transaction.
We then fetch the address lookup table accounts using the getAdressLookupTableAccounts method we defined earlier. This can be particularly useful for Token Swap instructions, as it allows us to pass many accounts to the transaction.
We then create and send a Solana Transaction using the instructions, address lookup table accounts, and the latest blockhash. We sign the transaction with our wallet and send it to the Solana network.
After confirming the transaction was successful, we call the postTransactionProcessing method to trigger necessary steps after a successful swap (updateNextTrade, refreshBalances, and logSwap). We already have refreshBalances and logSwap defined, so we will define updateNextTrade in the next section.
Update Next Trade
Finally, after a trade executes, we need to change our arguments for the next swap (redefining our NextTrade interface). We will define the updateNextTrade method to handle this. Add the following to bot.ts:
    private async updateNextTrade(lastTrade: QuoteResponse): Promise<void> {
        const priceChange = this.targetGainPercentage / 100;
        this.nextTrade = {
            inputMint: this.nextTrade.outputMint,
            outputMint: this.nextTrade.inputMint,
            amount: parseInt(lastTrade.outAmount),
            nextTradeThreshold: parseInt(lastTrade.inAmount) * (1 + priceChange),
        };
    }

For simplicity in this example, we will just swap the input and output mints (meaning, if we were buying SOL with USDC before, the next swap should sell USDC for SOL). We will also set the next trade thresholds. Our amount is the number of tokens we will put into our next trade--we are defining that as the amount of tokens we got out of the previous trade. Our nextTradeThreshold is the price at which we will execute our next trade. We define that as the number of tokens we put into our previous trade plus our target gain percentage. For example, if we used 10 USDC to buy 0.1 SOL in our previous trade and our target gain percentage is 15%; our next trade input (amount) will be 0.1 SOL, and the next trade threshold will be 11.5 USDC (meaning we expect our next trigger to yield 11.5 USDC).
Great work! You have now defined the core logic of our trading bot. All we need to do is create a client and run the bot. Let's do that now.
Create Client
Open index.ts and add the following code:
import { LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { ArbBot, SwapToken } from './bot';
import dotenv from "dotenv";

dotenv.config({
    path: ".env",
});

const defaultConfig = {
    solanaEndpoint: clusterApiUrl("mainnet-beta"),
    jupiter: "https://quote-api.jup.ag/v6",
};

async function main() {
    if (!process.env.SECRET_KEY) {
        throw new Error("SECRET_KEY environment variable not set");
    }
    let decodedSecretKey = Uint8Array.from(JSON.parse(process.env.SECRET_KEY));

    const bot = new ArbBot({
        solanaEndpoint: process.env.SOLANA_ENDPOINT ?? defaultConfig.solanaEndpoint,
        metisEndpoint: process.env.METIS_ENDPOINT ?? defaultConfig.jupiter,
        secretKey: decodedSecretKey,
        firstTradePrice: 0.11 * LAMPORTS_PER_SOL,
        targetGainPercentage: 1.5,
        initialInputToken: SwapToken.USDC,
        initialInputAmount: 10_000_000,
    });

    await bot.init();

}

main().catch(console.error);


This simple client will create an instance of our ArbBot and call the init method. We also use the dotenv package to load our environment variables from the .env file. We have included a default configuration object that will be used if the environment variables are not set. Let's explain our other input parameters to make sure we understand what's happening:
firstTradePrice is the price that we expect to receive in our first trade. In our example, we will buy SOL when we know we can get 0.11 SOL for our inputTokenAmount.
targetGainPercentage is the percentage gain we want to achieve in our trades. In our example, we are setting this to 1.5%. This means subsequent trades will be triggered when the price of SOL is 1.5% higher or lower than the previous trade.
initialInputToken is the token we will use to initiate our first trade. In our example, we are setting this to USDC.
initialInputAmount is the amount of tokens we will use to initiate our first trade. In our example, we are setting this to 10 USDC.
In short, we are setting up our bot to buy 0.11 SOL for 10 USDC when available. Subsequent trades will be triggered when the price of SOL is 1.5% higher or lower than the previous trade.
Run the Bot

TRADING ON MAINNET
Currently, Jupiter trading API is only available on Mainnet, meaning any trades executed will be real and irreversible. Please ensure you have a good understanding of the bot's logic and the potential risks before running it on Mainnet.
In your terminal, run the following command to start the bot:
ts-node index.ts

And that's it! You should see our 🤖 log initiating the bot and regular logs for price updates and confirmation of successful trades!
QuickNode $ts-node index.ts
🤖 Initiating arb bot for wallet: JUPz...Q1ie.
🏦 Current balances:
SOL: 0.01271548,
USDC: 10.087
📈 Current price: 97624457 is lower than the next trade threshold: 100000000 by 2.38%.


Nice job.
You can find our complete code on our GitHub.
Wrap Up
You have now experimented with the Jupiter API and QuickNode's Metis add-on. You have also built a simple trading bot that uses Jupiter's API to monitor the market for specific conditions and execute trades when those conditions are met. You can now experiment with different trade conditions and strategies to see how the bot performs. Looking for inspiration? Here are a few ideas:
Integrate durable nonces into your bot to increase transaction speed
Utilize Solana's Websocket Methods to monitor your bot's trading activity in real-time
Integrate Jupiter Terminal in your website
If you have a question or idea you want to share, drop us a line on Discord or Twitter!
We ❤️ Feedback!
Let us know if you have any feedback or requests for new topics. We'd love to hear from you.
Resources
Jupiter API Docs
Jupiter API Github
Metis: QuickNode Jupiter API Add-on
JupiterAPI.com - Public Jupiter API Endpoint