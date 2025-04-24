'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Floating Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass px-4 py-3 rounded-full flex items-center gap-6 animate-float shadow-xl backdrop-blur-md border border-white/10">
        <span className="text-xl font-bold text-primary mr-2">Syntrada</span>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#tools" className="text-sm hover:text-primary transition-colors">Tools</a>
          <a href="#stats" className="text-sm hover:text-primary transition-colors">Stats</a>
          <a href="#advantages" className="text-sm hover:text-primary transition-colors">Advantages</a>
          <a href="#token" className="text-sm hover:text-primary transition-colors">$SYNTRADA</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transform transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`}
          >
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <Link href="/app/calidatrade" className="hidden md:block btn-primary btn text-sm animate-glow-pulse">CalidaTrade</Link>
      </nav>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-40 glass rounded-2xl p-4 w-[90%] max-w-md transition-all duration-300 transform ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-4">
          <a 
            href="#tools" 
            className="text-sm hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
            onClick={() => setIsMenuOpen(false)}
          >
            Tools
          </a>
          <a 
            href="#stats" 
            className="text-sm hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
            onClick={() => setIsMenuOpen(false)}
          >
            Stats
          </a>
          <a 
            href="#advantages" 
            className="text-sm hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
            onClick={() => setIsMenuOpen(false)}
          >
            Advantages
          </a>
          <a 
            href="#token" 
            className="text-sm hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
            onClick={() => setIsMenuOpen(false)}
          >
            $SYNTRADA
          </a>
          <Link 
            href="/app/calidatrade" 
            className="text-sm hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
            onClick={() => setIsMenuOpen(false)}
          >
            CalidaTrade
          </Link>
        </div>
      </div>
    </>
  );
} 