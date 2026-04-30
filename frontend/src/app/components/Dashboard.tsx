"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Lightbulb, AlertTriangle, Lock, Loader2 } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { trendingStocks, marketNews, aiInsights as mockAiInsights, userProfile, generatePriceHistory } from "../data/mockData";
import { Badge } from "./ui/badge";
import { formatCurrency, getCurrencySymbol } from "../utils/formatters";
import { API_ENDPOINTS } from "../apiConfig";

export function Dashboard() {
  const [liveNews, setLiveNews] = useState(marketNews);
  const [liveInsights, setLiveInsights] = useState(mockAiInsights);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [profile, setProfile] = useState(userProfile);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('investorProfile');
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile({
          ...userProfile,
          totalInvested: parseFloat(parsed.investedAmount) || userProfile.totalInvested,
          portfolioValue: parseFloat(parsed.currentValue) || userProfile.portfolioValue,
          riskTolerance: parsed.riskLevel || userProfile.riskTolerance,
          tradingStyle: parsed.tradingStyle || userProfile.tradingStyle
        });
      }
    } catch (e) {
      console.error("Error parsing profile", e);
    }

    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.NEWS}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setLiveNews(data);
        }
      } catch (error) {
        console.error("Error fetching live news:", error);
      }
    };
    fetchNews();

    const fetchInsights = async () => {
      setInsightsLoading(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.INSIGHTS}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.insights?.length > 0) {
            setLiveInsights(data.insights);
          }
        }
      } catch (error) {
        console.error("Error fetching AI insights:", error);
      } finally {
        setInsightsLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const generateTrendedHistory = (startValue: number, endValue: number, days: number = 30) => {
    const data = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Calculate linear interpolation + random noise
      const progress = (days - i) / days;
      const baseValue = startValue + (endValue - startValue) * progress;
      // Add some realistic noise (wobble)
      const noise = (Math.random() - 0.5) * (Math.abs(endValue - startValue) * 0.1 || startValue * 0.01);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: parseFloat((baseValue + noise).toFixed(2))
      });
    }
    return data;
  };

  const portfolioHistory = generateTrendedHistory(profile.totalInvested, profile.portfolioValue, 30);

  const totalGainLoss = profile.portfolioValue - profile.totalInvested;
  const totalGainLossPercent = ((totalGainLoss / profile.totalInvested) * 100).toFixed(2);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'tip': return <Lightbulb className="w-4 h-4" />;
      case 'alert': return <AlertCircle className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'tip': return 'bg-primary/10 border-primary/30 text-primary';
      case 'alert': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-muted/50 border-border text-muted-foreground';
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Immersive Global Dashboard Background matching the requested aesthetic */}
      <div className="fixed inset-0 -z-10 bg-[#0f172a] dark:bg-black">
         <img 
           src="/dashboard-bg.png" 
           alt="Dashboard High-Tech Background" 
           className="w-full h-full object-cover opacity-70 mix-blend-screen dark:mix-blend-lighten pointer-events-none"
         />
         {/* Atmospheric overlays for text readability */}
         <div className="absolute inset-0 bg-background/50 dark:bg-background/40 backdrop-blur-[2px] pointer-events-none" />
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/90 pointer-events-none" />
         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 relative z-10 w-full">
      {/* Portfolio Overview Cards - Premium Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 premium-card group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/70">Current Value</p>
              <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-foreground tabular-nums">
              {formatCurrency(profile.portfolioValue)}
            </p>
            <div className={`mt-4 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${parseFloat(totalGainLossPercent) >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {parseFloat(totalGainLossPercent) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {parseFloat(totalGainLossPercent) >= 0 ? '+' : ''}{totalGainLossPercent}%
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 premium-card group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/70">Overall Profit/Loss</p>
              <div className={`p-2 rounded-xl group-hover:scale-110 transition-transform ${totalGainLoss >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {totalGainLoss >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
            </div>
            <p className={`text-3xl font-black tabular-nums ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
            </p>
            <p className="text-xs text-muted-foreground mt-4 font-bold opacity-60">
              {totalGainLoss >= 0 ? 'Great news! Your portfolio is up' : 'You are currently down'} {Math.abs(parseFloat(totalGainLossPercent))}% based on current market value.
            </p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 premium-card group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/70">Total Invested</p>
              <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-foreground tabular-nums">
              {formatCurrency(profile.totalInvested)}
            </p>
            <p className="text-xs text-indigo-400/80 mt-4 font-bold">Your starting capital 💰</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-6 premium-card group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/70">Risk Profile</p>
              <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-foreground capitalize">
              {profile.riskTolerance}
            </p>
            <p className="text-xs text-muted-foreground mt-4 font-bold italic">"{profile.tradingStyle}" strategy</p>
          </Card>
        </motion.div>
      </div>

      {/* Structured into perfectly aligned 1/3 Left, 2/3 Right layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (1/3 Width) - Live Market Pulse */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="h-full">
          <Card className="p-8 premium-card h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-indigo-400 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live Market Pulse
              </h3>
            </div>
            <div className="space-y-4 flex-1">
              {liveNews.slice(0, 4).map((news: any) => (
                <a href={news.link} target="_blank" rel="noopener noreferrer" key={news.id} className="group p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-indigo-500/30 transition-all hover:bg-black/10 dark:hover:bg-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-700 dark:text-indigo-200">{news.source}</Badge>
                      <span className="text-[10px] font-black text-muted-foreground">{news.timestamp}</span>
                    </div>
                    <h4 className="font-black text-sm leading-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{news.title}</h4>
                  </div>
                </a>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Right Column (2/3 Width) - AI Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2 h-full"
        >
          <Card className="p-8 premium-card h-full flex flex-col">
            <h3 className="text-xl font-black text-purple-400 mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6" />
              AI Insights
              {insightsLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin text-purple-400" />}
              {!insightsLoading && <Badge variant="outline" className="ml-2 text-[10px] font-black border-purple-500/30 text-purple-400">GEMINI LIVE</Badge>}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {insightsLoading ? (
                <div className="col-span-2 flex items-center justify-center h-40 gap-3 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="font-semibold">Gemini is analyzing live market data...</span>
                </div>
              ) : (
                liveInsights.map((insight: any) => (
                  <div key={insight.id} className={`p-5 rounded-xl border-2 transition-all hover:scale-[1.02] flex flex-col justify-between ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getInsightIcon(insight.type)}</div>
                      <div>
                        <p className="text-[15px] font-black tracking-tight leading-tight">{insight.title}</p>
                        <p className="text-sm mt-3 font-semibold leading-relaxed opacity-90">{insight.message}</p>
                      </div>
                    </div>
                    {insight.stocks && insight.stocks.length > 0 && (
                      <div className="flex gap-2 mt-4 ml-7">
                        {insight.stocks.map((s: string) => (
                          <Badge key={s} variant="secondary" className="text-xs font-black uppercase tracking-tighter bg-black/10 dark:bg-white/10 border-none">{s}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 
        =========================================
        MASSIVE HERO CHART (Exact Image Replica)
        =========================================
      */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <Card className="p-0 premium-card h-[400px] flex flex-col justify-center relative overflow-hidden group shadow-[0_0_40px_rgba(99,102,241,0.15)] border-indigo-500/20">
          

          <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioHistory}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={totalGainLoss >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={totalGainLoss >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={totalGainLoss >= 0 ? "#22c55e" : "#ef4444"} 
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                  strokeWidth={4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="absolute top-8 left-8 z-20">
             <div className="flex items-center gap-3 bg-card/40 backdrop-blur-md px-4 py-2 rounded-xl border border-border/50 mb-2 shadow-sm">
               <div className={`w-2 h-2 rounded-full animate-pulse ${totalGainLoss >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
               <span className="text-foreground font-bold tracking-widest text-sm">PORTFOLIO PERFORMANCE</span>
             </div>
             <p className="text-6xl font-black text-foreground tabular-nums drop-shadow-md">
                {formatCurrency(totalGainLoss)}
                <span className={`text-2xl ml-2 ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalGainLoss >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(totalGainLossPercent))}%
                </span>
             </p>
             <p className={`text-xl font-bold mt-2 tracking-wide uppercase drop-shadow-sm ${totalGainLoss >= 0 ? 'text-primary' : 'text-red-400'}`}>
                {totalGainLoss >= 0 ? 'Profit Generating...' : 'Portfolio Correction...'}
             </p>
          </div>

        </Card>
      </motion.div>



      </div>
    </div>
  );
}
