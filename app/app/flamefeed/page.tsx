'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function FlameFeed() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_100%)]"></div>
      </div>

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
          
          <Link href="/app/flamefeed" className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center glow-primary relative group">
            <div className="absolute inset-0 rounded-full border border-primary/40 group-hover:border-primary/60 transition-colors"></div>
            <Image 
              src="/module-flamefeed.svg" 
              alt="FlameFeed" 
              width={28} 
              height={28}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>

          <Link href="/app/calidatrade" className="w-14 h-14 rounded-full hover:bg-white/5 flex items-center justify-center transition-all duration-300 group">
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

      {/* Main content */}
      <div className="relative z-10 ml-28">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between backdrop-blur-sm bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center relative group">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite] group-hover:border-primary/40 transition-colors"></div>
              <Image 
                src="/module-flamefeed.svg" 
                alt="FlameFeed" 
                width={24} 
                height={24}
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-primary/70 bg-clip-text text-transparent">FlameFeed</h1>
          </div>
          <button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-4 py-2 rounded-full text-sm font-medium shadow-glow transition-all duration-300 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Pro Mode
          </button>
        </div>

        {/* Coming Soon Message */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Coming Soon
            </h2>
            <p className="text-white/70 max-w-md mx-auto">
              We're working on something exciting! Stay tuned for updates on our personalized news and updates feed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 