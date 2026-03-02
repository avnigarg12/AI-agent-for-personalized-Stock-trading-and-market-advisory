export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe?: number;
  sector: string;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface MarketNews {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'tip' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  stocks?: string[];
}

export const trendingStocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.42,
    change: 2.34,
    changePercent: 1.33,
    volume: 52430000,
    marketCap: 2800000000000,
    pe: 28.5,
    sector: "Technology"
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 875.28,
    change: 15.67,
    changePercent: 1.82,
    volume: 48920000,
    marketCap: 2150000000000,
    pe: 65.2,
    sector: "Technology"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 412.56,
    change: -3.21,
    changePercent: -0.77,
    volume: 31240000,
    marketCap: 3070000000000,
    pe: 35.8,
    sector: "Technology"
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 195.33,
    change: 8.94,
    changePercent: 4.80,
    volume: 98560000,
    marketCap: 620000000000,
    pe: 52.3,
    sector: "Automotive"
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.18,
    change: 1.56,
    changePercent: 1.11,
    volume: 28340000,
    marketCap: 1780000000000,
    pe: 24.6,
    sector: "Technology"
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.92,
    change: -2.14,
    changePercent: -1.18,
    volume: 42180000,
    marketCap: 1850000000000,
    pe: 48.2,
    sector: "Consumer Cyclical"
  }
];

export const portfolioHoldings: PortfolioHolding[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 25,
    avgCost: 165.50,
    currentPrice: 178.42,
    totalValue: 4460.50,
    gainLoss: 323.00,
    gainLossPercent: 7.81
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    shares: 10,
    avgCost: 725.00,
    currentPrice: 875.28,
    totalValue: 8752.80,
    gainLoss: 1502.80,
    gainLossPercent: 20.73
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    shares: 15,
    avgCost: 390.00,
    currentPrice: 412.56,
    totalValue: 6188.40,
    gainLoss: 338.40,
    gainLossPercent: 5.79
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    shares: 30,
    avgCost: 135.00,
    currentPrice: 142.18,
    totalValue: 4265.40,
    gainLoss: 215.40,
    gainLossPercent: 5.32
  }
];

export const marketNews: MarketNews[] = [
  {
    id: "1",
    title: "Federal Reserve Signals Potential Rate Cut in Q2",
    summary: "Fed officials hint at possible interest rate reduction following encouraging inflation data.",
    source: "Financial Times",
    timestamp: "2 hours ago",
    sentiment: "positive"
  },
  {
    id: "2",
    title: "Tech Sector Rally Continues Amid AI Optimism",
    summary: "Technology stocks surge as investors bet on AI-driven productivity gains.",
    source: "Bloomberg",
    timestamp: "4 hours ago",
    sentiment: "positive"
  },
  {
    id: "3",
    title: "Energy Prices Decline on Increased Supply",
    summary: "Oil and natural gas prices drop as production increases globally.",
    source: "Reuters",
    timestamp: "5 hours ago",
    sentiment: "neutral"
  },
  {
    id: "4",
    title: "Retail Earnings Beat Expectations",
    summary: "Major retailers report stronger-than-expected Q4 earnings, boosting consumer discretionary stocks.",
    source: "CNBC",
    timestamp: "1 day ago",
    sentiment: "positive"
  }
];

export const aiInsights: AIInsight[] = [
  {
    id: "1",
    type: "opportunity",
    title: "Potential Entry Point Detected",
    message: "MSFT has pulled back to a key support level. Based on your moderate risk profile, this could be a good accumulation opportunity. The stock maintains strong fundamentals with a P/E of 35.8.",
    timestamp: "1 hour ago",
    stocks: ["MSFT"]
  },
  {
    id: "2",
    type: "warning",
    title: "High Volatility Alert",
    message: "TSLA is showing increased volatility (4.8% daily move). Given your preference for stability, consider reducing position size or setting tighter stop losses.",
    timestamp: "3 hours ago",
    stocks: ["TSLA"]
  },
  {
    id: "3",
    type: "tip",
    title: "Portfolio Rebalancing Suggestion",
    message: "Your tech allocation is at 75%. Consider diversifying into defensive sectors like healthcare or utilities to balance risk.",
    timestamp: "1 day ago",
    stocks: []
  },
  {
    id: "4",
    type: "alert",
    title: "Earnings Report Tomorrow",
    message: "NVDA reports earnings tomorrow after market close. Historical volatility suggests a potential 5-7% move. Review your position sizing.",
    timestamp: "1 day ago",
    stocks: ["NVDA"]
  }
];

// Historical price data for charts
export const generatePriceHistory = (basePrice: number, days: number = 30) => {
  const data = [];
  let price = basePrice;
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * (basePrice * 0.02);
    price = Math.max(price + change, basePrice * 0.8);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 20000000
    });
  }
  
  return data;
};

export const userProfile = {
  name: "Alex Johnson",
  riskTolerance: "moderate" as const,
  investmentGoal: "growth" as const,
  tradingStyle: "swing" as const,
  experience: "intermediate" as const,
  portfolioValue: 23667.10,
  cashBalance: 5420.50,
  totalInvested: 19200.00
};
