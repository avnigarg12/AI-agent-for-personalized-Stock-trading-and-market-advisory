import { Link, useNavigate } from "react-router";
import { ArrowRight, TrendingUp, Target, Shield, Zap } from "lucide-react";
import { useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { AttractiveBackground } from "./AttractiveBackground";

export function Home() {
  const navigate = useNavigate();

  // Removed auto-redirect so the user can always see the beautiful Home page first.

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans transition-colors duration-300">
      {/* Navbar */}
      <nav className="absolute top-0 w-full p-8 flex justify-center items-center z-50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <span className="text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
            TradeMind AI
          </span>
        </div>
        <div className="absolute right-8 flex gap-5 items-center">
          <ThemeToggle />
          <Link to="/login" className="px-6 py-3 text-base font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Log In
          </Link>
          <Link to="/signup" className="px-7 py-3 text-base font-bold bg-primary text-primary-foreground hover:opacity-90 transition-colors rounded-xl shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 transform">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-40 pb-28 lg:pt-56 lg:pb-40 overflow-hidden min-h-screen flex items-center justify-center text-center">
        <AttractiveBackground />

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-base font-semibold mb-10 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            Accelerate your portfolio growth
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.05] drop-shadow-2xl max-w-5xl text-foreground">
            <span>
              MASTER THE
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-pulse">
              MARKET TRENDS
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-4xl leading-relaxed font-light">
            Navigate volatility with intelligent AI-driven insights. 
            Our advanced algorithms analyze market momentum and formulate strategies to grow your portfolio.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Link 
              to="/signup" 
              className="px-10 py-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            >
              Get AI Trade Suggestions
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link 
              to="/login" 
              className="px-10 py-5 bg-card/5 hover:bg-card/10 backdrop-blur-md border border-border text-foreground rounded-2xl text-xl font-bold flex items-center justify-center transition-colors shadow-xl"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-6xl">
            <div className="flex flex-col items-center text-center gap-6 p-8 rounded-[2rem] bg-card/80 border border-border backdrop-blur-xl hover:bg-card transition-colors shadow-2xl">
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                <Target className="w-10 h-10 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Precision Targeting</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Identify exact entry patterns during market trends. AI scans thousands of tickers to find lucrative opportunities exactly when you need them.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center gap-6 p-8 rounded-[2rem] bg-card/80 border border-border backdrop-blur-xl hover:bg-card transition-colors shadow-2xl">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                <Shield className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Risk Management</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Grow your wealth securely. Advanced tracking algorithms adapt to conditions to maximize upside while protecting your capital.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center gap-6 p-8 rounded-[2rem] bg-card/80 border border-border backdrop-blur-xl hover:bg-card transition-colors shadow-2xl">
              <div className="w-20 h-20 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-inner">
                <Zap className="w-10 h-10 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Real-Time Insights</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Receive lightning-fast actionable alerts directly to your dashboard. Stay one step ahead of the institutional players.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
