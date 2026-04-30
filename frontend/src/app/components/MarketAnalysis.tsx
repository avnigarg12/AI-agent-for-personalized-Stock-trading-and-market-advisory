import React, { useState, useEffect, useMemo } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, TrendingUp, TrendingDown, Info, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Stock, trendingStocks, generatePriceHistory } from "../data/mockData";
import { Badge } from "./ui/badge";
import { formatCurrency, getCurrencySymbol } from "../utils/formatters";
import { API_ENDPOINTS } from "../apiConfig";

export function MarketAnalysis() {
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingStocksState, setTrendingStocksState] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.MARKET}/trending`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTrendingStocksState(data);
        if (data.length > 0) {
          setSelectedStock(data[0]);
        }
      } catch (err) {
        console.warn("Backend not reachable, using mock data", err);
        setTrendingStocksState(trendingStocks);
        if (trendingStocks.length > 0) {
          setSelectedStock(trendingStocks[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    if (!selectedStock) return;
    const fetchHistory = async () => {
      setChartLoading(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.MARKET}/history/${selectedStock.symbol}?timeframe=${timeframe}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setPriceHistory(data);
      } catch (err) {
        console.warn("Backend not reachable, generating mock history", err);
        const days = timeframe === '1D' ? 1 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
        setPriceHistory(generatePriceHistory(selectedStock.price, days));
      } finally {
        setChartLoading(false);
      }
    };
    fetchHistory();
  }, [selectedStock?.symbol, timeframe]);

  const handleSearchKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const query = searchQuery.trim().toUpperCase();

      setLoading(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.MARKET}/search?query=${query}`);
        if (res.ok) {
          const results = await res.json();
          if (results && results.length > 0) {
            const currentSymbols = new Set(trendingStocksState.map(s => s.symbol));
            const newUniqueStocks = results.filter((s: Stock) => !currentSymbols.has(s.symbol));
            if (newUniqueStocks.length > 0) {
              setTrendingStocksState([...newUniqueStocks, ...trendingStocksState]);
            }
            setSelectedStock(results[0]);
          } else {
            alert(`No stocks found matching "${query}". Try adding .NS for Indian stocks (e.g. RELIANCE.NS) or .BO for BSE.`);
          }
        } else {
          throw new Error("Search failed");
        }
      } catch (error) {
        console.warn("Search error:", error);
        const found = trendingStocks.find(s =>
          s.symbol.toUpperCase().includes(query) ||
          s.name.toUpperCase().includes(query)
        );
        if (found) {
          setSelectedStock(found);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredStocks = searchQuery
    ? trendingStocksState.filter(stock =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : trendingStocksState;

  const [technicalIndicators, setTechnicalIndicators] = useState<any>({
    rsi: 58.3,
    ma50: 0,
    ma200: 0,
    volume: 0,
    volatility: 28.5,
    beta: 1.25,
    prediction: 0
  });

  useEffect(() => {
    if (!selectedStock) return;
    const fetchTechnicals = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.MARKET}/technicals/${selectedStock.symbol}`);
        if (res.ok) {
          const data = await res.json();
          setTechnicalIndicators({
            ...data,
            volume: selectedStock.volume,
            avgVolume: selectedStock.volume * 0.85
          });
        }
      } catch (err) {
        console.warn("Failed to fetch technicals", err);
      }
    };
    fetchTechnicals();
  }, [selectedStock?.symbol]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-lg text-muted-foreground">Loading market data...</span>
      </div>
    );
  }

  if (!selectedStock) {
    return (
      <div className="p-8 flex items-center justify-center h-[600px]">
        <span className="text-lg text-muted-foreground">No stock data available</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="fixed inset-0 -z-10 bg-[#020617] overflow-hidden">
        <img
          src="/market-bg.png"
          alt="Market Analysis Background"
          className="w-full h-full object-cover opacity-40 dark:opacity-50 pointer-events-none mix-blend-screen"
        />
        <div className="absolute inset-0 bg-background/80 dark:bg-background/70 backdrop-blur-[3px] pointer-events-none" />
      </div>

      <div className="p-4 md:p-8 relative z-10 w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stock List Sidebar (Back to Left) */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-card border-border">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    placeholder="Search stocks..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${selectedStock.symbol === stock.symbol
                      ? 'bg-primary/20 border border-primary/50'
                      : 'bg-muted/30 hover:bg-muted/50 border border-transparent'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-black text-foreground tracking-tight">{stock.symbol}</p>
                        <p className="text-[10px] font-bold text-muted-foreground line-clamp-1 uppercase tracking-wider">{stock.name}</p>
                      </div>
                      {stock.changePercent >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-black text-sm text-foreground">
                        {formatCurrency(stock.price, stock.currency, stock.symbol)}
                      </p>
                      <p className={`text-[10px] font-bold ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Stock Analysis Content (Back to Right) */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-6 bg-card border-border">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-black text-foreground tracking-tight">{selectedStock.symbol}</h2>
                    <Badge variant={selectedStock.changePercent >= 0 ? 'default' : 'destructive'} className="text-xs">
                      {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                  <p className="text-muted-foreground font-bold uppercase tracking-wider text-xs">{selectedStock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-foreground tabular-nums">
                    {formatCurrency(selectedStock.price, selectedStock.currency, selectedStock.symbol)}
                  </p>
                  <p className={`text-sm font-bold ${selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} Today
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex bg-muted/50 p-1 rounded-lg">
                  {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
                    <Button
                      key={tf}
                      variant={timeframe === tf ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setTimeframe(tf as any)}
                      className={`px-3 py-1 h-auto text-xs font-bold ${timeframe === tf ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                    >
                      {tf}
                    </Button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={priceHistory}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedStock.changePercent >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={selectedStock.changePercent >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.1} />
                  <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="price" stroke={selectedStock.changePercent >= 0 ? "#10b981" : "#ef4444"} fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-900/40">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-blue-100 mb-1">AI-Powered Analysis</h4>
                    <p className="text-sm text-gray-600 dark:text-blue-200/60">Based on technical indicators</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-foreground mb-2">Recommendation</p>
                    <Badge className="mb-2 bg-primary text-white">
                      {selectedStock.changePercent >= 0 && technicalIndicators.rsi < 70 ? 'BUY' :
                        selectedStock.changePercent < 0 && technicalIndicators.rsi > 30 ? 'HOLD' : 'WATCH'}
                    </Badge>
                    <p className="text-sm text-gray-700 dark:text-muted-foreground/90">
                      {selectedStock.symbol} shows {selectedStock.changePercent >= 0 ? 'positive' : 'negative'} momentum with {technicalIndicators.rsi > 70 ? 'overbought' : technicalIndicators.rsi < 30 ? 'oversold' : 'neutral'} technical signals. The stock is trading {selectedStock.price > technicalIndicators.ma200 ? 'above' : 'below'} its 200-day moving average.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-foreground mb-2">Risk Assessment</p>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline" className="dark:border-white/20 dark:text-white/80">Volatility: {technicalIndicators.volatility.toFixed(1)}%</Badge>
                        <Badge variant="outline" className="dark:border-white/20 dark:text-white/80">Beta: {technicalIndicators.beta.toFixed(2)}</Badge>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-muted-foreground/90">
                        This stock is {technicalIndicators.beta > 1 ? 'more volatile than' : 'less volatile than'} the market.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900 dark:text-foreground mb-2">Suggested Strategy</p>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-muted-foreground/90">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                          <span>Entry: {formatCurrency(selectedStock.price * 0.97, selectedStock.currency, selectedStock.symbol)} - {formatCurrency(selectedStock.price, selectedStock.currency, selectedStock.symbol)}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                          <span>Target: {formatCurrency(selectedStock.price * 1.15, selectedStock.currency, selectedStock.symbol)}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
