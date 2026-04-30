import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, DollarSign, Wallet, Activity, Lightbulb, Loader2, Plus, Trash2 } from "lucide-react";
import { userProfile } from "../data/mockData";
import { Badge } from "./ui/badge";
import { formatCurrency } from "../utils/formatters";
import { API_ENDPOINTS } from "../apiConfig";

// Types
interface Holding {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

interface AIInsight {
  id: string;
  type: string;
  title: string;
  message: string;
  stocks: string[];
}

export function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);

  // Form State
  const [newSymbol, setNewSymbol] = useState("");
  const [newShares, setNewShares] = useState("");
  const [newAvgCost, setNewAvgCost] = useState("");

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("user_portfolio");
    if (saved) {
      setHoldings(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  // Fetch Live Prices & Recommendations
  const updatePortfolioData = async (currentHoldings: Holding[]) => {
    if (currentHoldings.length === 0) {
      setInsights([]);
      return;
    }
    setInsightsLoading(true);
    let updatedHoldings = [...currentHoldings];

    try {
      // 1. Fetch live quotes using correct individual symbol endpoints
      const quotesPromises = currentHoldings.map(async (holding) => {
        try {
          const res = await fetch(`${API_ENDPOINTS.MARKET}/quote/${holding.symbol}`);
          if (res.ok) {
            return await res.json();
          }
        } catch (err) {
          console.warn(`Failed to fetch quote for ${holding.symbol}`);
        }
        return null;
      });
      
      const liveQuotesArray = await Promise.all(quotesPromises);
      const liveQuotes = liveQuotesArray.filter(Boolean);
      
      if (liveQuotes.length > 0) {
        updatedHoldings = currentHoldings.map(holding => {
          const liveQuote = liveQuotes.find((q: any) => q.symbol === holding.symbol);
          if (liveQuote) {
            const currentPrice = liveQuote.price || holding.avgCost; // Fallback to avgCost if error
            const totalValue = holding.shares * currentPrice;
            const gainLoss = totalValue - (holding.shares * holding.avgCost);
            const gainLossPercent = (gainLoss / (holding.shares * holding.avgCost)) * 100;
            return { ...holding, currentPrice, totalValue, gainLoss, gainLossPercent, name: liveQuote.name || holding.name };
          }
          return holding;
        });
        setHoldings(updatedHoldings);
        localStorage.setItem("user_portfolio", JSON.stringify(updatedHoldings));
        
        // Update global profile metrics
        const totalV = updatedHoldings.reduce((sum, h) => sum + h.totalValue, 0);
        const totalI = updatedHoldings.reduce((sum, h) => sum + (h.shares * h.avgCost), 0);
        const storedProfile = localStorage.getItem('investorProfile');
        if (storedProfile) {
          const p = JSON.parse(storedProfile);
          p.currentValue = totalV.toString();
          p.investedAmount = totalI.toString();
          localStorage.setItem('investorProfile', JSON.stringify(p));
        }
      }

      // 2. Fetch AI Recommendations
      const recommendRes = await fetch(`${API_ENDPOINTS.PORTFOLIO}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holdings: updatedHoldings })
      });
      if (recommendRes.ok) {
        const data = await recommendRes.json();
        if (data.success) {
          setInsights(data.recommendations || []);
        }
      }
    } catch (e) {
      console.error("Failed to update portfolio data", e);
    } finally {
      setInsightsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && holdings.length > 0) {
      // Initial fetch if local storage had data
      updatePortfolioData(holdings);
    }
  }, [loading]);

  const addHolding = async () => {
    if (!newSymbol || !newShares || !newAvgCost) return;

    const newAsset: Holding = {
      symbol: newSymbol.toUpperCase(),
      name: newSymbol.toUpperCase(),
      shares: parseFloat(newShares),
      avgCost: parseFloat(newAvgCost),
      currentPrice: parseFloat(newAvgCost), // temp
      totalValue: parseFloat(newShares) * parseFloat(newAvgCost), // temp
      gainLoss: 0,
      gainLossPercent: 0
    };

    const updated = [...holdings, newAsset];
    setHoldings(updated);
    localStorage.setItem("user_portfolio", JSON.stringify(updated));
    setNewSymbol(""); setNewShares(""); setNewAvgCost("");
    
    // Refresh prices and get new recommendations
    await updatePortfolioData(updated);
  };

  const removeHolding = async (symbol: string) => {
    const updated = holdings.filter(h => h.symbol !== symbol);
    setHoldings(updated);
    localStorage.setItem("user_portfolio", JSON.stringify(updated));
    await updatePortfolioData(updated);
  };

  // Metrics Calculations
  const totalHoldingsValue = holdings.reduce((sum, holding) => sum + holding.totalValue, 0);
  const totalInvestedAmount = holdings.reduce((sum, holding) => sum + (holding.shares * holding.avgCost), 0);
  const totalProfitLoss = totalHoldingsValue - totalInvestedAmount;
  const returnPercentage = totalInvestedAmount > 0 ? ((totalProfitLoss / totalInvestedAmount) * 100).toFixed(2) : "0.00";

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background/50 backdrop-blur-lg">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen h-full flex flex-col p-4 md:p-8 overflow-y-auto bg-transparent space-y-8 w-full z-0">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[#020617] dark:bg-black overflow-hidden pointer-events-none">
        <img src="/green-matrix-bg.png" alt="Background" className="w-full h-full object-cover opacity-60 mix-blend-screen dark:mix-blend-lighten pointer-events-none" />
        <div className="absolute inset-0 bg-background/70 dark:bg-background/60 backdrop-blur-[4px] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto space-y-8">
        
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 premium-card group">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/70">Total Value</p>
                <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-foreground tabular-nums">{formatCurrency(totalHoldingsValue)}</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 premium-card group">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/70">Invested Amount</p>
                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-foreground tabular-nums">{formatCurrency(totalInvestedAmount)}</p>
            </Card>
          </motion.div>
        </div>

        {/* Portfolio Management & Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Holdings Input Form */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="lg:col-span-1">
            <Card className="p-6 premium-card flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl">
              <h3 className="text-xl font-black text-foreground mb-6">Add New Asset</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Ticker Symbol</label>
                  <input
                    type="text"
                    value={newSymbol}
                    placeholder="e.g. AAPL"
                    onChange={(e) => setNewSymbol(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary uppercase transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Number of Shares</label>
                  <input
                    type="number"
                    value={newShares}
                    placeholder="e.g. 10"
                    onChange={(e) => setNewShares(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Buy Price</label>
                  <input
                    type="number"
                    value={newAvgCost}
                    placeholder="e.g. 150"
                    onChange={(e) => setNewAvgCost(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  onClick={addHolding}
                  className="w-full mt-4 bg-primary text-primary-foreground font-black py-3 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  <Plus className="w-5 h-5" /> Add Holding
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Dynamic AI Insights */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-xl font-black text-foreground mb-2 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-indigo-400" />
              Personalized AI Recommendations
              {insightsLoading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground ml-2" />}
            </h3>
            
            {holdings.length === 0 ? (
              <Card className="p-8 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center h-full">
                 <p className="text-muted-foreground font-bold">Add holdings to see AI recommendations for your portfolio.</p>
              </Card>
            ) : insightsLoading ? (
              <Card className="p-8 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center h-full min-h-[250px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-bold animate-pulse">Generating personalized strategy...</p>
              </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.map((insight) => (
                      <Card key={insight.id} className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] -mr-16 -mt-16 rounded-full transition-transform group-hover:scale-150" />
                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-black text-indigo-300">
                              {insight.title}
                            </h4>
                            {insight.type === 'opportunity' && <Badge className="bg-green-500/20 text-green-400 border-none">BUY</Badge>}
                            {insight.type === 'warning' && <Badge className="bg-red-500/20 text-red-400 border-none">SELL/REDUCE</Badge>}
                            {insight.type === 'alert' && <Badge className="bg-yellow-500/20 text-yellow-400 border-none">ALERT</Badge>}
                            {insight.type === 'tip' && <Badge className="bg-blue-500/20 text-blue-400 border-none">HOLD/TIP</Badge>}
                          </div>
                          <p className="text-muted-foreground font-bold text-sm leading-relaxed mb-4 flex-1 whitespace-pre-wrap">
                            {insight.message}
                          </p>
                          {insight.stocks && insight.stocks.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              {insight.stocks.map(s => (
                                <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded font-black text-xs text-foreground">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                  ))}
                </div>
            )}
          </motion.div>
        </div>

        {/* Holdings List - Premium Table */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="premium-card overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black text-foreground">Asset Holdings</h3>
              <Badge variant="secondary" className="font-black text-xs tracking-widest">{holdings.length} ASSETS</Badge>
            </div>
            
            {holdings.length === 0 ? (
               <div className="p-12 text-center text-muted-foreground font-bold">
                 No assets in portfolio yet. Use the form above to add your holdings.
               </div>
            ) : (
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="bg-white/5">
                        <th className="text-left p-6 font-black text-muted-foreground text-[11px] uppercase tracking-widest">Asset</th>
                        <th className="text-right p-6 font-black text-muted-foreground text-[11px] uppercase tracking-widest">Shares</th>
                        <th className="text-right p-6 font-black text-muted-foreground text-[11px] uppercase tracking-widest">Buy Price</th>
                        <th className="text-right p-6 font-black text-muted-foreground text-[11px] uppercase tracking-widest">Current Price</th>
                        <th className="text-right p-6 font-black text-muted-foreground text-[11px] uppercase tracking-widest">Invested Value</th>
                        <th className="text-right p-6 font-black text-muted-foreground text-[11px] uppercase tracking-widest">Current Value</th>
                        <th className="text-center p-6 font-black text-muted-foreground text-[11px] uppercase tracking-widest">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {holdings.map((holding) => (
                        <tr key={holding.symbol} className="group hover:bg-white/5 transition-all">
                        <td className="p-6">
                            <div className="font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{holding.symbol}</div>
                            <div className="text-xs font-bold text-muted-foreground uppercase mt-1">{holding.name}</div>
                        </td>
                        <td className="p-6 text-right font-black tabular-nums">{holding.shares}</td>
                        <td className="p-6 text-right font-black tabular-nums text-muted-foreground">
                            {formatCurrency(holding.avgCost, undefined, holding.symbol)}
                        </td>
                        <td className="p-6 text-right font-black tabular-nums">
                            {formatCurrency(holding.currentPrice, undefined, holding.symbol)}
                        </td>
                        <td className="p-6 text-right font-black tabular-nums">
                            {formatCurrency(holding.shares * holding.avgCost, undefined, holding.symbol)}
                        </td>
                        <td className="p-6 text-right font-black tabular-nums text-foreground">
                            {formatCurrency(holding.totalValue, undefined, holding.symbol)}
                        </td>
                        <td className="p-6 text-center">
                            <button
                               onClick={() => removeHolding(holding.symbol)}
                               className="text-red-400/50 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                               title="Remove Asset"
                            >
                                <Trash2 className="w-5 h-5 mx-auto" />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
