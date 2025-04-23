import Image from "next/image";
import Link from "next/link";
import SplineBackground from "./components/SplineBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <SplineBackground />
      
      {/* Floating Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass px-4 py-3 rounded-full flex items-center gap-6 animate-float shadow-xl backdrop-blur-md border border-white/10">
        <span className="text-xl font-bold text-primary mr-2">Syntrada</span>
        <div className="hidden md:flex items-center gap-6">
          <a href="#tools" className="text-sm hover:text-primary transition-colors">Tools</a>
          <a href="#stats" className="text-sm hover:text-primary transition-colors">Stats</a>
          <a href="#advantages" className="text-sm hover:text-primary transition-colors">Advantages</a>
          <a href="#token" className="text-sm hover:text-primary transition-colors">$FIRE Token</a>
          <Link href="/app/calidatrade" className="text-sm hover:text-primary transition-colors">CalidaTrade</Link>
        </div>
        <Link href="/launch" className="btn-primary btn text-sm animate-glow-pulse">Launch App</Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-primary">Explore Web3</span> Smarter.<br />
              Burn Through The Noise.
            </h1>
            <p className="text-lg text-text-muted mb-8 max-w-md">
              An AI-powered intelligence platform for the Solana ecosystem — delivering real-time intelligence across tokens, wallets, contracts, and launches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/app" className="btn btn-primary animate-slide-up stagger-1">
                Get Started
              </Link>
              <Link href="/docs" className="btn btn-outline animate-slide-up stagger-2">
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative animate-fade-in stagger-3">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 via-accent/10 to-info/20 blur-xl animate-pulse-slow opacity-70"></div>
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Dashboard Interface */}
              <div className="bg-surface-raised p-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-surface/30 rounded-md px-2 py-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-xs font-medium">Live Data</span>
                  </div>
                  <div className="bg-primary/20 text-primary rounded-md px-2 py-1 text-xs font-medium">Syntrada Analytics</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-px bg-white/5">
                {/* Left Panel - Token Overview */}
                <div className="bg-surface/95 p-4 relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-primary">TokenTorch</h3>
                    <div className="bg-surface-raised rounded-md px-1.5 py-0.5 text-[10px]">PRO</div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-surface-raised rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-xs font-bold">SOL</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Solana</div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-success">$150.44</span>
                        <span className="text-[9px] bg-success/10 text-success rounded px-1">+3.6%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <div className="h-20 w-full mb-4 relative">
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10"></div>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute bottom-0 bg-primary/80 w-[3px] rounded-t-sm animate-slide-up" 
                        style={{ 
                          left: `${i * 4.16}%`, 
                          height: `${30 + Math.sin(i/2) * 20 + Math.random() * 15}%`,
                          animationDelay: `${i * 50}ms`
                        }}
                      ></div>
                    ))}
                    <div className="absolute top-1 right-1 bg-surface-raised/50 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-[9px]">24h</div>
                  </div>
                  
                  {/* Risk Assessment */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Market Cap</span>
                      <span className="font-medium">$61.2B</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Liquidity</span>
                      <span className="text-primary font-medium">Very High</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Risk Level</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span className="text-success">Low</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-[10px] border-t border-white/5 pt-2">
                    <span className="text-white/50">Updated 28s ago</span>
                    <button className="text-primary">Analyze</button>
                  </div>
                </div>
                
                {/* Middle Panel - Chat */}
                <div className="bg-surface/95 col-span-2 flex flex-col">
                  <div className="p-4 flex-grow">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Image
                          src="/module-blazebot.svg" 
                          alt="BlazeBot" 
              width={20}
              height={20}
            />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">BlazeBot AI</h3>
                        <div className="text-[10px] text-white/60">AI Assistant</div>
                      </div>
                      <div className="ml-auto flex items-center">
                        <div className="bg-success/10 rounded-full px-2 py-0.5 text-[10px] text-success flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                          <span>Online</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="glass rounded-lg p-3 max-w-[80%] text-sm animate-slide-in-left">
                        Analyze the JUP token ecosystem and its on-chain metrics
                      </div>
                      
                      <div className="bg-surface-raised rounded-lg p-3 border border-white/5 ml-auto max-w-[85%] animate-slide-in-right stagger-2">
                        <p className="text-primary font-medium text-sm mb-2">Jupiter (JUP) Analysis:</p>
                        
                        <div className="mb-3 grid grid-cols-2 gap-2">
                          <div className="bg-surface/30 rounded-md p-2">
                            <div className="text-[10px] text-white/60">Current Price</div>
                            <div className="text-sm font-medium">$1.64 <span className="text-[10px] text-success">+5.2%</span></div>
                          </div>
                          <div className="bg-surface/30 rounded-md p-2">
                            <div className="text-[10px] text-white/60">Market Cap</div>
                            <div className="text-sm font-medium">$1.84B</div>
                          </div>
                          <div className="bg-surface/30 rounded-md p-2">
                            <div className="text-[10px] text-white/60">24h Volume</div>
                            <div className="text-sm font-medium">$124.5M</div>
                          </div>
                          <div className="bg-surface/30 rounded-md p-2">
                            <div className="text-[10px] text-white/60">Holders</div>
                            <div className="text-sm font-medium">243,188</div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-[10px] text-white/60 mb-1">On-Chain Activity (7d)</div>
                          <div className="h-8 flex items-end gap-1">
                            {Array.from({ length: 7 }).map((_, i) => (
                              <div 
                                key={i} 
                                className="flex-1 bg-primary/60 rounded-sm animate-slide-up" 
                                style={{ 
                                  height: `${50 + Math.random() * 50}%`,
                                  animationDelay: `${i * 100}ms`
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full w-[85%]"></div>
                          </div>
                          <span className="text-[10px] text-success font-medium">Safe</span>
                        </div>
                        
                        <div className="flex gap-1 flex-wrap">
                          <div className="bg-surface/30 rounded-full px-2 py-0.5 text-[10px]">High Liquidity</div>
                          <div className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-[10px]">Verified</div>
                          <div className="bg-success/20 text-success rounded-full px-2 py-0.5 text-[10px]">Audited</div>
                          <div className="bg-info/20 text-info rounded-full px-2 py-0.5 text-[10px]">Top DEX</div>
                        </div>
                      </div>
                      
                      <div className="glass rounded-lg p-3 max-w-[80%] text-sm animate-slide-in-left stagger-3">
                        Compare it with BONK and show me price prediction
                      </div>
                      
                      <div className="ml-auto relative">
                        <div className="animate-pulse-slow flex gap-1.5 ml-auto mb-1 justify-end">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-white/5 flex items-center gap-3">
                    <div className="flex-grow glass rounded-full px-4 py-2 text-sm text-white/60">Ask about any Solana token or wallet...</div>
                    <button className="bg-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 11L12 6M12 6L17 11M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 12 12)"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Bottom Panel - Multi-Tool Preview */}
              <div className="bg-surface p-3 grid grid-cols-4 gap-2 border-t border-white/5">
                <div className="bg-surface-raised rounded-md p-2 flex flex-col items-center text-center group hover:bg-primary/10 transition-colors duration-300">
                  <Image 
                    src="/module-blazebot.svg" 
                    alt="BlazeBot" 
                    width={16} 
                    height={16} 
                    className="mb-1"
                  />
                  <span className="text-[10px] font-medium">BlazeBot</span>
        </div>
                <div className="bg-surface-raised rounded-md p-2 flex flex-col items-center text-center group hover:bg-primary/10 transition-colors duration-300">
          <Image
                    src="/module-tokentorch.svg" 
                    alt="TokenTorch" 
            width={16}
            height={16}
                    className="mb-1"
                  />
                  <span className="text-[10px] font-medium">TokenTorch</span>
                </div>
                <div className="bg-surface-raised rounded-md p-2 flex flex-col items-center text-center group hover:bg-primary/10 transition-colors duration-300">
          <Image
                    src="/module-walletwarden.svg" 
                    alt="WalletWarden" 
            width={16}
            height={16}
                    className="mb-1"
                  />
                  <span className="text-[10px] font-medium">WalletWarden</span>
                </div>
                <div className="bg-surface-raised rounded-md p-2 flex flex-col items-center text-center group hover:bg-primary/10 transition-colors duration-300">
          <Image
                    src="/module-flamefeed.svg" 
                    alt="FlameFeed" 
            width={16}
            height={16}
                    className="mb-1"
                  />
                  <span className="text-[10px] font-medium">FlameFeed</span>
                </div>
                <div className="bg-surface-raised rounded-md p-2 flex flex-col items-center text-center group hover:bg-primary/10 transition-colors duration-300">
                  <Image
                    src="/module-walletwarden.svg" 
                    alt="CalidaTrade" 
                    width={16}
                    height={16}
                    className="mb-1"
                  />
                  <span className="text-[10px] font-medium">CalidaTrade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-20 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful features to <span className="text-primary">simplify</span> your<br />
            web3 experience
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Our integrated tools give you the edge in the Solana ecosystem, all powered by the latest AI technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* BlazeBot */}
          <div className="glass rounded-3xl p-8 border border-white/5 hover:border-primary/20 transition-all duration-300 animate-fade-in stagger-1 group hover:shadow-lg hover:-translate-y-1">
            <div className="relative mb-6 h-48 overflow-hidden rounded-xl bg-gradient-to-br from-surface-raised to-surface">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                
                {/* Chat UI Elements */}
                <div className="w-full max-w-[90%] px-4">
                  <div className="flex flex-col gap-2 overflow-hidden">
                    <div className="glass rounded-lg p-2 max-w-[80%] text-[10px] animate-slide-in-left opacity-90">
                      What's the APY for SOL staking?
                    </div>
                    <div className="bg-surface rounded-lg p-2 text-[10px] border border-border ml-auto max-w-[80%] animate-slide-in-right delay-150 opacity-90">
                      <p className="text-primary text-[10px] font-medium">Current SOL Staking</p>
                      <p className="text-[10px]">Average APY: 6.8%</p>
                      <div className="mt-1 h-1.5 w-full bg-surface-raised rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[68%]"></div>
                      </div>
                    </div>
                    
                    {/* Add more interactive chat elements */}
                    <div className="glass rounded-lg p-2 max-w-[80%] text-[10px] animate-slide-in-left delay-300 opacity-90">
                      Any risks with JUP token?
                    </div>
                    <div className="bg-surface rounded-lg p-2 text-[10px] border border-border ml-auto max-w-[80%] animate-slide-in-right delay-450 opacity-90">
                      <p className="text-primary text-[10px] font-medium">Jupiter (JUP) Analysis</p>
                      <div className="flex gap-1 mt-1">
                        <span className="bg-success/20 text-success rounded px-1 text-[8px]">Low Risk</span>
                        <span className="bg-primary/20 text-primary rounded px-1 text-[8px]">Verified</span>
                      </div>
                      <p className="text-[9px] mt-1">High liquidity across 5 major DEXs with strong on-chain metrics</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent"></div>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite]"></div>
                <Image 
                  src="/module-blazebot.svg" 
                  alt="BlazeBot" 
                  width={20} 
                  height={20} 
                  className="group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">BlazeBot</h3>
            </div>
            
            <p className="text-text-muted mb-6 leading-relaxed">
              AI crypto assistant for all your Solana ecosystem queries with real-time data.
            </p>
            <Link href="/app/blazebot" className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
              Try BlazeBot
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
                <path d="M8 3L14 8L8 13M14 8H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* TokenTorch */}
          <div className="glass rounded-3xl p-8 border border-white/5 hover:border-primary/20 transition-all duration-300 animate-fade-in stagger-2 group hover:shadow-lg hover:-translate-y-1">
            <div className="relative mb-6 h-48 overflow-hidden rounded-xl bg-gradient-to-br from-surface-raised to-surface">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                
                {/* Enhanced Token Analysis Dashboard */}
                <div className="w-full max-w-[90%] bg-surface/30 rounded-lg p-3 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-[10px] font-medium">MANGO</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-primary font-medium">+5.2%</span>
                      <div className="bg-primary/20 rounded-full px-1.5 py-0.5 text-[8px]">24h</div>
                    </div>
                  </div>
                  
                  {/* Mini Chart with animation */}
                  <div className="h-12 flex items-end gap-0.5">
                    {[20, 26, 22, 28, 24, 30, 28, 35, 32, 38, 34, 40, 38, 44].map((height, i) => (
                      <div 
                        key={i} 
                        className={`w-full ${i < 7 ? 'bg-white/20' : 'bg-primary/70'} rounded-sm animate-slide-up`}
                        style={{ height: `${height}%`, animationDelay: `${i * 50}ms` }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Enhanced risk assessment */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]">Risk:</span>
                      <div className="h-1.5 flex-1 bg-surface-raised rounded-full overflow-hidden">
                        <div className="h-full w-[30%] bg-success rounded-full"></div>
                      </div>
                      <span className="text-[10px] text-success">Low</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]">Liquidity:</span>
                      <div className="h-1.5 flex-1 bg-surface-raised rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-primary rounded-full"></div>
                      </div>
                      <span className="text-[10px] text-primary">High</span>
                    </div>
                    
                    <div className="flex gap-1 mt-1">
                      <span className="bg-white/10 rounded-full text-[8px] px-1.5 py-0.5">Audited</span>
                      <span className="bg-primary/20 rounded-full text-[8px] px-1.5 py-0.5">Strong Team</span>
                      <span className="bg-info/20 text-info rounded-full text-[8px] px-1.5 py-0.5">Listed</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent"></div>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite]"></div>
                <Image 
                  src="/module-tokentorch.svg" 
                  alt="TokenTorch" 
                  width={20} 
                  height={20} 
                  className="group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">TokenTorch</h3>
            </div>
            
            <p className="text-text-muted mb-6 leading-relaxed">
              Token scanning and analysis tool for comprehensive risk assessment.
            </p>
            <Link href="/app/tokentorch" className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
              Analyze Tokens
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
                <path d="M8 3L14 8L8 13M14 8H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* WalletWarden */}
          <div className="glass rounded-3xl p-8 border border-white/5 hover:border-primary/20 transition-all duration-300 animate-fade-in stagger-3 group hover:shadow-lg hover:-translate-y-1">
            <div className="relative mb-6 h-48 overflow-hidden rounded-xl bg-gradient-to-br from-surface-raised to-surface">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                
                {/* Enhanced Wallet Portfolio Visualization */}
                <div className="w-full max-w-[90%] bg-surface/30 rounded-lg p-3 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-medium">Portfolio Value</span>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-[10px] text-primary font-medium">$24,586.32</span>
                  </div>
                  
                  {/* Interactive Portfolio Visualization */}
                  <div className="flex gap-1 mb-2 group-hover:animate-pulse">
                    <div className="h-3 rounded-l-sm bg-primary flex-[3_3_0%] group-hover:flex-[3.2_3.2_0%] transition-all"></div>
                    <div className="h-3 bg-accent flex-[2_2_0%] group-hover:flex-[1.9_1.9_0%] transition-all"></div>
                    <div className="h-3 bg-info flex-[1.5_1.5_0%] group-hover:flex-[1.6_1.6_0%] transition-all"></div>
                    <div className="h-3 rounded-r-sm bg-success flex-[1_1_0%] group-hover:flex-[1.1_1.1_0%] transition-all"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>SOL 60%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span>JUP 20%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-info"></div>
                      <span>BONK 15%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span>USDC 5%</span>
                    </div>
                  </div>
                  
                  {/* Transaction activity */}
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-white/70">Recent Activity</span>
                      <span className="text-[9px] text-primary">Live</span>
                    </div>
                    <div className="mt-1 text-[8px] flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                      <span className="text-success">+12.5 SOL</span>
                      <span className="text-white/50">•</span>
                      <span className="text-white/50">2 min ago</span>
                    </div>
                    <div className="mt-0.5 text-[8px] flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-error rounded-full"></div>
                      <span className="text-error">-125 BONK</span>
                      <span className="text-white/50">•</span>
                      <span className="text-white/50">15 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent"></div>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite]"></div>
                <Image 
                  src="/module-walletwarden.svg" 
                  alt="WalletWarden" 
                  width={20} 
                  height={20} 
                  className="group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">WalletWarden</h3>
            </div>
            
            <p className="text-text-muted mb-6 leading-relaxed">
              Wallet analysis tool for comprehensive asset and risk assessment.
            </p>
            <Link href="/app/walletwarden" className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
              Check Wallets
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
                <path d="M8 3L14 8L8 13M14 8H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* FlameFeed */}
          <div className="glass rounded-3xl p-8 border border-white/5 hover:border-primary/20 transition-all duration-300 animate-fade-in stagger-4 group hover:shadow-lg hover:-translate-y-1">
            <div className="relative mb-6 h-48 overflow-hidden rounded-xl bg-gradient-to-br from-surface-raised to-surface">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                
                {/* Enhanced News Feed Elements with interactive UI */}
                <div className="w-full max-w-[90%] space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="bg-primary/20 rounded-full px-2 py-0.5 text-[8px]">
                      <span className="text-primary">Personalized Feed</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-[8px]">Live</span>
                    </div>
                  </div>
                  
                  <div className="bg-surface/30 rounded-lg p-2 border border-white/5 animate-slide-in-left stagger-1 hover:border-primary/20 transition-all group-hover:translate-x-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-[9px] font-medium">BREAKING</span>
                      </div>
                      <span className="text-[8px] text-text-muted">10m ago</span>
                    </div>
                    <p className="text-[9px] line-clamp-1">Solana DeFi protocol launches new governance token</p>
                    <div className="flex gap-1 mt-1 items-center">
                      <div className="bg-white/10 rounded-full px-1 text-[7px]">DeFi</div>
                      <div className="bg-primary/10 rounded-full px-1 text-[7px] text-primary">Solana</div>
                      <div className="h-3 w-12 flex-grow bg-surface-raised rounded-full overflow-hidden ml-auto">
                        <div className="h-full bg-primary rounded-full w-[85%]"></div>
                      </div>
                      <span className="text-[7px]">85%</span>
                    </div>
                  </div>
                  
                  <div className="bg-surface/30 rounded-lg p-2 border border-white/5 animate-slide-in-left stagger-2 hover:border-primary/20 transition-all group-hover:translate-x-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <span className="text-[9px] font-medium">TRENDING</span>
                      </div>
                      <span className="text-[8px] text-text-muted">25m ago</span>
                    </div>
                    <p className="text-[9px] line-clamp-1">Major wallet provider adds support for new tokens</p>
                    <div className="flex gap-1 mt-1 items-center">
                      <div className="bg-white/10 rounded-full px-1 text-[7px]">Wallets</div>
                      <div className="bg-accent/10 rounded-full px-1 text-[7px] text-accent">Update</div>
                      <div className="h-3 w-12 flex-grow bg-surface-raised rounded-full overflow-hidden ml-auto">
                        <div className="h-full bg-accent rounded-full w-[68%]"></div>
                      </div>
                      <span className="text-[7px]">68%</span>
                    </div>
                  </div>
                  
                  <div className="bg-surface/30 rounded-lg p-2 border border-white/5 animate-slide-in-left stagger-3 hover:border-primary/20 transition-all group-hover:translate-x-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-info"></div>
                        <span className="text-[9px] font-medium">UPDATES</span>
                      </div>
                      <span className="text-[8px] text-text-muted">45m ago</span>
                    </div>
                    <p className="text-[9px] line-clamp-1">New DEX records $1B in trading volume within 24 hours</p>
                    <div className="flex gap-1 mt-1 items-center">
                      <div className="bg-white/10 rounded-full px-1 text-[7px]">DEX</div>
                      <div className="bg-info/10 rounded-full px-1 text-[7px] text-info">Volume</div>
                      <div className="h-3 w-12 flex-grow bg-surface-raised rounded-full overflow-hidden ml-auto">
                        <div className="h-full bg-info rounded-full w-[92%]"></div>
                      </div>
                      <span className="text-[7px]">92%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent"></div>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite]"></div>
                <Image 
                  src="/module-flamefeed.svg" 
                  alt="FlameFeed" 
                  width={20} 
                  height={20} 
                  className="group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">FlameFeed</h3>
            </div>
            
            <p className="text-text-muted mb-6 leading-relaxed">
              Personalized news and updates feed curated by AI for relevance.
            </p>
            <Link href="/app/flamefeed" className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
              Read Updates
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
                <path d="M8 3L14 8L8 13M14 8H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4 md:px-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center animate-fade-in">
          Syntrada Analytics<br />Platform Impact
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* First Card */}
          <div className="glass rounded-3xl p-8 border border-primary/10 animate-slide-in-left hover:shadow-glow transition-all duration-500 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-accent/40"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 to-accent/5 blur-xl animate-pulse-slow"></div>
            <div className="relative">
              <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">Token Intelligence</h3>
              <div className="h-48 relative flex items-end pb-4">
                <div className="flex items-end gap-3 w-full">
                  <div className="bg-primary/20 w-[14%] h-16 rounded-t-md animate-slide-up stagger-1 group-hover:h-20 transition-all duration-300"></div>
                  <div className="bg-primary/30 w-[14%] h-20 rounded-t-md animate-slide-up stagger-2 group-hover:h-24 transition-all duration-300"></div>
                  <div className="bg-primary/40 w-[14%] h-24 rounded-t-md animate-slide-up stagger-3 group-hover:h-28 transition-all duration-300"></div>
                  <div className="bg-primary/50 w-[14%] h-28 rounded-t-md animate-slide-up stagger-4 group-hover:h-32 transition-all duration-300"></div>
                  <div className="bg-primary/60 w-[14%] h-32 rounded-t-md animate-slide-up stagger-5 group-hover:h-36 transition-all duration-300"></div>
                  <div className="bg-primary w-[14%] h-40 rounded-t-md relative overflow-hidden animate-slide-up stagger-5 group-hover:h-44 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-primary to-primary/70 animate-pulse-slow"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full border-t border-dashed border-white/20"></div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-3xl font-bold text-primary animate-scale">53K+</div>
                <div className="text-text-muted text-sm group-hover:text-white transition-colors duration-300">Tokens Scanned</div>
              </div>
            </div>
          </div>

          {/* Second Card */}
          <div className="glass rounded-3xl p-8 border border-primary/10 animate-slide-in-bottom hover:shadow-glow transition-all duration-500 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-accent/40"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 to-accent/5 blur-xl animate-pulse-slow"></div>
            <div className="relative">
              <h3 className="text-2xl font-semibold mb-6 group-hover:text-primary transition-colors duration-300">AI Performance</h3>
              
              <div className="mb-10 relative">
                <div className="flex items-center mb-4 animate-fade-in stagger-1">
                  <div className="w-16 h-16 rounded-full border-4 border-primary border-r-transparent animate-spin-slow group-hover:animate-[spin_1s_linear_infinite] transition-all duration-300 group-hover:shadow-glow"></div>
                  <div className="ml-4 transform group-hover:translate-x-2 transition-transform duration-300">
                    <div className="text-xl font-bold group-hover:text-primary transition-colors duration-300">93%</div>
                    <div className="text-text-muted text-sm group-hover:text-white transition-colors duration-300">AI Risk Accuracy</div>
                  </div>
                </div>
                
                <div className="flex items-center animate-fade-in stagger-2">
                  <div className="w-16 h-16 rounded-full border-4 border-accent border-r-transparent animate-spin-slow group-hover:animate-[spin_1s_linear_infinite] transition-all duration-300 group-hover:shadow-glow"></div>
                  <div className="ml-4 transform group-hover:translate-x-2 transition-transform duration-300">
                    <div className="text-xl font-bold group-hover:text-accent transition-colors duration-300">2.1s</div>
                    <div className="text-text-muted text-sm group-hover:text-white transition-colors duration-300">Avg Response Time</div>
                  </div>
                </div>
              </div>
              
              <div className="text-xl font-bold text-primary mt-2 animate-scale">3M</div>
              <div className="text-text-muted text-sm group-hover:text-white transition-colors duration-300">Tool Interactions</div>
            </div>
          </div>

          {/* Third Card */}
          <div className="glass rounded-3xl p-8 border border-primary/10 animate-slide-in-right hover:shadow-glow transition-all duration-500 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-accent/40"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 to-accent/5 blur-xl animate-pulse-slow"></div>
            <div className="relative">
              <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">Wallet Analysis</h3>
              
              <div className="space-y-3 py-6">
                <div className="flex items-center justify-between animate-slide-in-left stagger-1 group-hover:translate-x-1 transition-transform duration-300">
                  <div className="bg-surface/30 px-2 py-1 rounded text-xs group-hover:bg-primary/20 transition-colors duration-300">Whale</div>
                  <div className="h-[2px] flex-1 mx-3 bg-white/10 group-hover:bg-primary/20 transition-colors duration-300"></div>
                  <div className="bg-surface/30 px-2 py-1 rounded text-xs group-hover:bg-primary/20 transition-colors duration-300">16,328</div>
                </div>
                
                <div className="flex items-center justify-between animate-slide-in-left stagger-2 group-hover:translate-x-1 transition-transform duration-300">
                  <div className="bg-surface/30 px-2 py-1 rounded text-xs group-hover:bg-primary/20 transition-colors duration-300">Standard</div>
                  <div className="h-[2px] flex-1 mx-3 bg-white/10 group-hover:bg-primary/20 transition-colors duration-300"></div>
                  <div className="bg-primary/30 px-2 py-1 rounded text-xs">142,069</div>
                </div>
                
                <div className="flex items-center justify-between animate-slide-in-left stagger-3 group-hover:translate-x-1 transition-transform duration-300">
                  <div className="bg-accent/30 px-2 py-1 rounded text-xs">New</div>
                  <div className="h-[2px] flex-1 mx-3 bg-white/10 group-hover:bg-primary/20 transition-colors duration-300"></div>
                  <div className="bg-surface/30 px-2 py-1 rounded text-xs group-hover:bg-primary/20 transition-colors duration-300">141,603</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-3xl font-bold text-primary animate-scale">300K</div>
                <div className="text-text-muted text-sm group-hover:text-white transition-colors duration-300">Wallets Analyzed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="advantages" className="py-20 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold mb-2 animate-fade-in">
            <span className="text-white/50">Results In</span> <span className="text-white">5 Minutes</span><span className="text-white/50">, Not</span> <span className="text-white">5 Days</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 relative">
          {/* With Syntrada */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-primary mb-4 animate-fade-in">With Syntrada</h3>
              <div className="flex justify-center gap-6 mb-6 animate-fade-in">
                <div className="flex items-center gap-2">
                  <svg className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6V12L8 16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">3-5 Min</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L20 6M20 6L16 2M20 6L16 10M15 18H4M4 18L8 14M4 18L8 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">4 Steps</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M14.5 9C14.5 9 13.7609 8 11.9999 8C8.49998 8 8.49998 12 11.9999 12C15.4999 12 15.5 16 12 16C10.5 16 9.5 15 9.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 7V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">Free</span>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-xl p-6 border border-white/10 animate-fade-in h-[300px] relative">
              <div className="h-[220px] flex items-end gap-4">
                <div className="h-full flex-1 flex flex-col justify-end">
                  <div className="bg-primary/20 w-full h-[30%] rounded-t-sm"></div>
                  <div className="text-center text-xs mt-2 text-white/70">$0.4M</div>
                </div>
                <div className="h-full flex-1 flex flex-col justify-end">
                  <div className="bg-primary/30 w-full h-[40%] rounded-t-sm"></div>
                  <div className="text-center text-xs mt-2 text-white/70">$0.6M</div>
                </div>
                <div className="h-full flex-1 flex flex-col justify-end">
                  <div className="bg-primary/60 w-full h-[70%] rounded-t-sm"></div>
                  <div className="text-center text-xs mt-2 text-white/70">$1M</div>
                </div>
                <div className="h-full flex-1 flex flex-col justify-end">
                  <div className="bg-primary/40 w-full h-[50%] rounded-t-sm"></div>
                  <div className="text-center text-xs mt-2 text-white/70">$0.8M</div>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-sm text-white/70">AI-Powered Risk Assessment</div>
                <div className="font-medium mt-1">93% accuracy detecting scams</div>
              </div>
            </div>
            
            <div className="glass rounded-xl p-6 border border-white/10 animate-fade-in">
              <div className="flex">
                <div className="w-1/2 pr-4">
                  <div className="flex items-center justify-between">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 rounded-full border-8 border-white/5"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-primary border-r-transparent animate-spin-slow"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div>
                          <div className="text-2xl font-bold text-center">$1.2M</div>
                          <div className="flex items-center justify-center text-xs text-primary">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 20V4M12 4L18 10M12 4L6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Up 24%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 pl-4 flex flex-col justify-between">
                  <div>
                    <div className="text-sm text-white/70">Real-Time Intelligence</div>
                    <div className="font-medium mt-1">Updates in seconds, not minutes</div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-white/70">Instant metrics and insights</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Without Syntrada */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white/70 mb-4 animate-fade-in">Without Syntrada</h3>
              <div className="flex justify-center gap-6 mb-6 animate-fade-in">
                <div className="flex items-center gap-2">
                  <svg className="text-white/50" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6V12L8 16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">5 Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="text-white/50" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L20 6M20 6L16 2M20 6L16 10M15 18H4M4 18L8 14M4 18L8 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">15 Steps</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="text-white/50" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M14.5 9C14.5 9 13.7609 8 11.9999 8C8.49998 8 8.49998 12 11.9999 12C15.4999 12 15.5 16 12 16C10.5 16 9.5 15 9.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 7V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">$400-$1500</span>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-xl p-6 border border-white/10 animate-fade-in h-[300px] relative">
              <div className="h-[220px] flex items-end gap-4">
                <div className="h-full flex-1 flex flex-col justify-end">
                  <div className="border-l-2 border-dashed border-white/20 h-full"></div>
                  <div className="text-center text-xs mt-2 text-white/50">$0</div>
                </div>
                <div className="h-full flex-1 flex flex-col justify-end">
                  <div className="border-l-2 border-dashed border-white/20 h-full"></div>
                  <div className="text-center text-xs mt-2 text-white/50">$0</div>
                </div>
                <div className="h-full flex-1 flex flex-col justify-end">
                  <div className="border-l-2 border-dashed border-white/20 h-full"></div>
                  <div className="text-center text-xs mt-2 text-white/50">$0</div>
                </div>
                <div className="h-full flex-1 flex flex-col justify-end">
                  <div className="border-l-2 border-dashed border-white/20 h-full"></div>
                  <div className="text-center text-xs mt-2 text-white/50">$0</div>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-sm text-white/50">Manual</div>
                <div className="font-medium mt-1 text-white/70">No automated assessment</div>
              </div>
            </div>
            
            <div className="glass rounded-xl p-6 border border-white/10 animate-fade-in">
              <div className="flex">
                <div className="w-1/2 pr-4">
                  <div className="flex items-center justify-between">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 rounded-full border-8 border-white/5"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-white/20 border-r-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div>
                          <div className="text-2xl font-bold text-center text-white/70">$0</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 pl-4 flex flex-col justify-between">
                  <div>
                    <div className="text-sm text-white/50">No Multi-Chain Support</div>
                    <div className="font-medium mt-1 text-white/70">Limited protocol coverage</div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-white/50">No metrics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center">
          <Link href="/features" className="btn btn-primary px-8 animate-glow-pulse">
            Experience the Difference
          </Link>
        </div>
      </section>

      {/* Token Section */}
      <section id="token" className="py-20 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="glass p-8 md:p-12 rounded-3xl animate-fade-in">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
                <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm text-primary font-medium">$FIRE Token</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Powering the Syntrada Ecosystem</h2>
              <p className="text-text-muted mb-8">
                The FIRE token powers all platform functionality and rewards platform users. Stake to unlock premium features and earn rewards from protocol fees.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-surface/10 p-4 rounded-lg animate-scale stagger-1">
                  <p className="text-text-muted text-sm mb-1">Total Supply</p>
                  <p className="text-xl font-bold">100,000,000</p>
                </div>
                <div className="bg-surface/10 p-4 rounded-lg animate-scale stagger-2">
                  <p className="text-text-muted text-sm mb-1">Initial Price</p>
                  <p className="text-xl font-bold">$0.015</p>
                </div>
                <div className="bg-surface/10 p-4 rounded-lg animate-scale stagger-3">
                  <p className="text-text-muted text-sm mb-1">Staking APY</p>
                  <p className="text-xl font-bold">12-24%</p>
                </div>
                <div className="bg-surface/10 p-4 rounded-lg animate-scale stagger-4">
                  <p className="text-text-muted text-sm mb-1">Platform Fee</p>
                  <p className="text-xl font-bold">3%</p>
                </div>
              </div>
              <Link href="/token" className="btn btn-primary animate-glow-pulse">
                Token Details
              </Link>
            </div>
            <div className="relative animate-slide-in-right">
              <div className="absolute -inset-4 rounded-full bg-primary/20 blur-3xl animate-pulse-slow"></div>
              <div className="relative aspect-square rounded-full border border-primary flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute inset-4 rounded-full border-4 border-primary/30 animate-[spin_15s_linear_infinite]"></div>
                <div className="absolute inset-8 rounded-full border-4 border-primary/40 animate-[spin_10s_linear_infinite_reverse]"></div>
                <div className="absolute inset-12 rounded-full border-4 border-primary/60 animate-[spin_5s_linear_infinite]"></div>
                <div className="relative w-24 h-24 flex items-center justify-center bg-primary rounded-full shadow-glow text-2xl font-bold animate-pulse-slow">
                  FIRE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
