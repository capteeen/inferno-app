'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AppDashboard() {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden relative">
      {/* Futuristic background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden opacity-20">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] left-[30%] w-1/3 h-1/3 bg-info/5 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
      </div>
      
      {/* Floating Sidebar */}
      <div className="fixed top-1/2 -translate-y-1/2 left-8 z-50 glass rounded-full py-6 px-4 border border-white/10 shadow-xl backdrop-blur-md bg-black/30">
        <div className="flex flex-col items-center gap-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center relative group">
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite] group-hover:border-primary/40 transition-colors"></div>
            <Image 
              src="/inferno-logo.svg" 
              alt="Syntrada" 
              width={32} 
              height={32}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          
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
              src="/module-walletwarden.svg" 
              alt="TradeWarden" 
              width={28} 
              height={28}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
          
          <Link href="/app/walletwarden" className="w-14 h-14 rounded-full hover:bg-white/5 flex items-center justify-center transition-all duration-300 group">
            <Image 
              src="/module-walletwarden.svg" 
              alt="WalletWarden" 
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
          
          <Link href="/app/infernotrade" className="w-14 h-14 rounded-full hover:bg-white/5 flex items-center justify-center transition-all duration-300 group">
            <Image 
              src="/module-walletwarden.svg" 
              alt="InfernoTrade" 
              width={28} 
              height={28}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
          
          <div className="w-14 h-14 rounded-full hover:bg-white/5 flex items-center justify-center transition-all duration-300 group">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="flex-1 flex flex-col ml-28 z-10">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between backdrop-blur-sm bg-black/30">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-primary/70 bg-clip-text text-transparent">Dashboard</h1>
          <button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-4 py-2 rounded-full text-sm font-medium shadow-glow transition-all duration-300 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upgrade to Pro
          </button>
        </div>
        
        {/* Dashboard Content */}
        <div className="p-6 flex-1 overflow-auto bg-grid-white/[0.01] bg-[length:30px_30px]">
          <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-primary/50 bg-clip-text text-transparent flex items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-2">
              <path d="M5 12H3L12 3L21 12H19M5 12V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Welcome to Syntrada
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-xl p-4 border border-white/10 backdrop-blur-md bg-black/30 shadow-glow hover:shadow-[0_0_15px_rgba(255,94,94,0.2)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 via-transparent to-transparent blur-md opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mr-2">
                    <path d="M8 18L12 22L16 18M12 2V22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 className="text-sm text-text-muted">Tokens Scanned</h3>
                </div>
                <p className="text-2xl font-bold">53,481</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 border border-white/10 backdrop-blur-md bg-black/30 shadow-glow hover:shadow-[0_0_15px_rgba(255,94,94,0.2)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 via-transparent to-transparent blur-md opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mr-2">
                    <path d="M17 11H13V7M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 className="text-sm text-text-muted">Wallets Analyzed</h3>
                </div>
                <p className="text-2xl font-bold">304,192</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 border border-white/10 backdrop-blur-md bg-black/30 shadow-glow hover:shadow-[0_0_15px_rgba(255,94,94,0.2)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 via-transparent to-transparent blur-md opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mr-2">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 className="text-sm text-text-muted">AI Risk Accuracy</h3>
                </div>
                <p className="text-2xl font-bold">93%</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 border border-white/10 backdrop-blur-md bg-black/30 shadow-glow hover:shadow-[0_0_15px_rgba(255,94,94,0.2)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 via-transparent to-transparent blur-md opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mr-2">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 className="text-sm text-text-muted">Response Time</h3>
                </div>
                <p className="text-2xl font-bold">2.1s</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-primary/50 bg-clip-text text-transparent flex items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-2">
              <path d="M21 13.2554C18.2207 14.3805 15.1827 15 12 15C8.8173 15 5.7793 14.3805 3 13.2554M16 6V4C16 2.89543 15.1046 2 14 2H10C8.89543 2 8 2.89543 8 4V6M12 12H12.01M5 9H19M21 9C21 15.0751 16.0751 20 10 20C3.92486 20 1 15.0751 1 9C1 8.44772 1.44772 8 2 8H22C22.5523 8 23 8.44772 23 9C23 9.6488 23 9 21 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/app/blazebot" className="glass rounded-xl p-4 border border-white/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-md bg-black/30 shadow-glow hover:shadow-[0_0_15px_rgba(255,94,94,0.3)] group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                  <div className="absolute inset-0 rounded-full border border-primary/20 group-hover:border-primary/40 transition-colors"></div>
                  <Image 
                    src="/module-blazebot.svg" 
                    alt="BlazeBot" 
                    width={24} 
                    height={24}
                  />
                </div>
                <h3 className="font-bold group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary/70 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">BlazeBot</h3>
              </div>
              <p className="text-sm text-text-muted">AI crypto assistant for all your queries</p>
            </Link>
            
            <Link href="/app/tokentorch" className="glass rounded-xl p-4 border border-white/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-md bg-black/30 shadow-glow hover:shadow-[0_0_15px_rgba(255,94,94,0.3)] group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                  <div className="absolute inset-0 rounded-full border border-primary/20 group-hover:border-primary/40 transition-colors"></div>
                  <Image 
                    src="/module-walletwarden.svg" 
                    alt="TradeWarden" 
                    width={24} 
                    height={24}
                  />
                </div>
                <h3 className="font-bold group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary/70 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">TradeWarden</h3>
              </div>
              <p className="text-sm text-text-muted">Token scanning and risk assessment</p>
            </Link>
            
            <Link href="/app/walletwarden" className="glass rounded-xl p-4 border border-white/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-md bg-black/30 shadow-glow hover:shadow-[0_0_15px_rgba(255,94,94,0.3)] group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                  <div className="absolute inset-0 rounded-full border border-primary/20 group-hover:border-primary/40 transition-colors"></div>
                  <Image 
                    src="/module-walletwarden.svg" 
                    alt="WalletWarden" 
                    width={24} 
                    height={24}
                  />
                </div>
                <h3 className="font-bold group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary/70 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">WalletWarden</h3>
              </div>
              <p className="text-sm text-text-muted">Wallet analysis and risk assessment</p>
            </Link>
            
            <Link href="/app/flamefeed" className="glass rounded-xl p-4 border border-white/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-md bg-black/30 shadow-glow hover:shadow-[0_0_15px_rgba(255,94,94,0.3)] group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                  <div className="absolute inset-0 rounded-full border border-primary/20 group-hover:border-primary/40 transition-colors"></div>
                  <Image 
                    src="/module-flamefeed.svg" 
                    alt="FlameFeed" 
                    width={24} 
                    height={24}
                  />
                </div>
                <h3 className="font-bold group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary/70 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">FlameFeed</h3>
              </div>
              <p className="text-sm text-text-muted">Personalized news and updates feed</p>
            </Link>
            
            <Link href="/app/infernotrade" className="glass rounded-xl p-4 border border-white/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-md bg-black/30 shadow-glow hover:shadow-[0_0_15px_rgba(255,94,94,0.3)] group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                  <div className="absolute inset-0 rounded-full border border-primary/20 group-hover:border-primary/40 transition-colors"></div>
                  <Image 
                    src="/module-walletwarden.svg" 
                    alt="InfernoTrade" 
                    width={24} 
                    height={24}
                  />
                </div>
                <h3 className="font-bold group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary/70 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">InfernoTrade</h3>
              </div>
              <p className="text-sm text-text-muted">Token swap interface powered by Jupiter</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 