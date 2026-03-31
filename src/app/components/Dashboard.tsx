import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Lightbulb, AlertTriangle } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { trendingStocks, marketNews, aiInsights, userProfile, generatePriceHistory } from "../data/mockData";
import { Badge } from "./ui/badge";

export function Dashboard() {
  const portfolioHistory = generatePriceHistory(userProfile.portfolioValue, 30);
  const totalGainLoss = userProfile.portfolioValue - userProfile.totalInvested;
  const totalGainLossPercent = ((totalGainLoss / userProfile.totalInvested) * 100).toFixed(2);

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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-400">Welcome back!</h2>
        <p className="text-muted-foreground mt-1">Here's what's happening with your investments today</p>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Portfolio Value</p>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${userProfile.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-sm mt-2 ${parseFloat(totalGainLossPercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {parseFloat(totalGainLossPercent) >= 0 ? '+' : ''}{totalGainLossPercent}% all time
          </p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
          </div>
          <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Since inception
          </p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Cash Balance</p>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${userProfile.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Available to invest
          </p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Risk Level</p>
            <AlertCircle className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-foreground capitalize">
            {userProfile.riskTolerance}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {userProfile.tradingStyle} trader
          </p>
        </Card>
      </div>

      {/* Portfolio Chart and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 lg:col-span-2 bg-card border-border">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">Portfolio Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={portfolioHistory}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#8b8b9f"
                tick={{ fontSize: 12, fill: '#8b8b9f' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="#8b8b9f"
                tick={{ fontSize: 12, fill: '#8b8b9f' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(124, 58, 237, 0.3)', borderRadius: '8px', color: '#e5e5f0' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#7c3aed" 
                fillOpacity={1} 
                fill="url(#colorValue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">AI Insights</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-2 mb-1">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{insight.title}</p>
                    <p className="text-xs mt-1 opacity-90">{insight.message}</p>
                    {insight.stocks && insight.stocks.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {insight.stocks.map((stock) => (
                          <Badge key={stock} variant="outline" className="text-xs">
                            {stock}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs opacity-75 mt-1">{insight.timestamp}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trending Stocks and Market News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">Trending Stocks</h3>
          <div className="space-y-3">
            {trendingStocks.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{stock.symbol}</p>
                    <Badge variant="outline" className="text-xs">{stock.sector}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${stock.price.toFixed(2)}</p>
                  <p className={`text-sm ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">Market News</h3>
          <div className="space-y-4">
            {marketNews.map((news) => (
              <div key={news.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-foreground flex-1">{news.title}</h4>
                  <Badge 
                    variant={news.sentiment === 'positive' ? 'default' : news.sentiment === 'negative' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {news.sentiment}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{news.summary}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{news.source}</span>
                  <span>•</span>
                  <span>{news.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
