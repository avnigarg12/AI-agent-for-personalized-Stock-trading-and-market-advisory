import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Bot, User, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Badge } from "./ui/badge";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  stocks?: string[];
  sentiment?: 'bullish' | 'bearish' | 'neutral';
}

export function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your TradeMind AI advisor. I'm here to help you make informed trading decisions based on your goals and risk tolerance. I can analyze stocks, explain market trends, suggest portfolio adjustments, and answer any investment questions you have. How can I assist you today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    }
  ]);
  const [input, setInput] = useState("");

  const aiResponses: { [key: string]: Message } = {
    'default': {
      id: '',
      role: 'assistant',
      content: "I understand you're interested in that. Based on your moderate risk profile and growth-focused investment goal, I can help you analyze this from multiple angles. Could you provide more specific details about what aspect you'd like me to focus on?",
      timestamp: new Date(),
    },
    'apple|aapl': {
      id: '',
      role: 'assistant',
      content: "Apple (AAPL) is currently trading at $178.42, up 1.33% today. Here's my analysis:\n\n✅ Strengths: Strong brand loyalty, Services revenue growth at 16% YoY, healthy cash flow of $99.6B annually\n\n⚠️ Considerations: P/E ratio of 28.5 is above historical average, iPhone sales growth slowing in China\n\n📊 Technical: Stock is trending above 50-day and 200-day moving averages, showing bullish momentum\n\nGiven your moderate risk tolerance, AAPL could be a solid core holding. The company's diversification into services provides stability. Consider dollar-cost averaging if adding to your position.",
      timestamp: new Date(),
      stocks: ['AAPL'],
      sentiment: 'bullish'
    },
    'nvidia|nvda': {
      id: '',
      role: 'assistant',
      content: "NVIDIA (NVDA) at $875.28 (+1.82% today) is an interesting but volatile opportunity:\n\n✅ Growth Drivers: AI chip demand remains extremely strong, data center revenue up 279% YoY, partnerships with major cloud providers\n\n⚠️ Risks: High valuation (P/E: 65.2), competitive pressure from AMD and custom chips, potential regulatory concerns in China\n\n📉 Volatility: NVDA has 30-day volatility of 42%, much higher than market average\n\nFor your moderate risk profile, I'd suggest: If you don't own NVDA, consider a small position (5-7% of portfolio). If you already own it, consider taking some profits and rebalancing. Avoid overconcentration given the volatility.\n\nWould you like me to suggest a specific allocation strategy?",
      timestamp: new Date(),
      stocks: ['NVDA'],
      sentiment: 'neutral'
    },
    'tesla|tsla': {
      id: '',
      role: 'assistant',
      content: "Tesla (TSLA) is up 4.80% today at $195.33. Let me break this down:\n\n⚡ Momentum: Strong short-term momentum with 4.8% daily gain, volume 98.5M shares (above average)\n\n📊 Fundamentals: P/E of 52.3 reflects growth expectations, but competition in EV space is intensifying\n\n⚠️ Volatility Warning: TSLA is highly volatile and sentiment-driven. Given your preference for stability, this should be a smaller position if any.\n\n💡 My Recommendation: If you want exposure to EV/clean energy, consider a diversified EV ETF instead of concentrating risk in TSLA. If you insist on individual exposure, limit to 3-5% of portfolio and use stop-loss orders.\n\nRemember: Your trading style is swing trading, so if you enter TSLA, have clear entry/exit points planned.",
      timestamp: new Date(),
      stocks: ['TSLA'],
      sentiment: 'neutral'
    },
    'portfolio|diversif|allocation': {
      id: '',
      role: 'assistant',
      content: "Great question about portfolio management! Let me analyze your current allocation:\n\n📊 Current Breakdown:\n• Technology: ~75% (AAPL, NVDA, MSFT, GOOGL)\n• Other sectors: ~25%\n\n⚠️ Concentration Risk: Your tech exposure is quite high. While tech has performed well, this creates sector risk.\n\n💡 Rebalancing Suggestions:\n1. Reduce tech to 50-60% of portfolio\n2. Add defensive sectors: Healthcare (10-15%), Consumer Staples (10%)\n3. Consider adding bonds/fixed income for stability (10-15%)\n4. Keep 5-10% in cash for opportunities\n\n🎯 This would better align with your moderate risk tolerance while maintaining growth potential.\n\nWould you like specific stock or ETF recommendations for diversification?",
      timestamp: new Date(),
      sentiment: 'neutral'
    },
    'buy|sell|when|entry|exit': {
      id: '',
      role: 'assistant',
      content: "Timing is crucial! As a swing trader with moderate risk tolerance, here's my framework for entry/exit decisions:\n\n📈 Entry Signals:\n• Stock pulls back to support level (50-day MA)\n• RSI below 30 (oversold)\n• Positive news catalyst + technical setup\n• Volume confirmation on bounce\n\n📉 Exit Signals:\n• Hit target profit (I suggest 15-25% for swing trades)\n• Break below stop loss (typically 7-10% below entry)\n• Negative fundamental change (earnings miss, guidance cut)\n• Technical breakdown below key support\n\n⏰ Avoid These Timing Mistakes:\n❌ Chasing after big up days\n❌ Selling winners too early out of fear\n❌ Averaging down on falling stocks without plan\n❌ Trading based on social media hype\n\n💡 Pro Tip: Use limit orders instead of market orders to control your entry price, especially in volatile stocks.\n\nWant me to analyze specific entry/exit points for a stock you're watching?",
      timestamp: new Date(),
    },
    'risk|loss|stop': {
      id: '',
      role: 'assistant',
      content: "Risk management is the foundation of successful trading! Here's your personalized risk strategy:\n\n🛡️ Position Sizing:\n• Max 10% in any single stock\n• Max 25% in any single sector\n• Keep 10-15% in cash buffer\n\n⛔ Stop Loss Guidelines:\n• Set stops 7-10% below entry for moderate volatility stocks\n• 5-7% for high volatility (like TSLA)\n• Adjust stops to break-even once up 10%+\n\n📊 Portfolio Risk:\n• Your current volatility: Moderate (β ≈ 1.1)\n• Target max drawdown: -15% (aligned with moderate risk)\n• If down 10%, reassess positions\n\n💡 Emotional Discipline:\n• Never risk more than you can afford to lose\n• Don't check portfolio constantly (leads to overtrading)\n• Stick to your trading plan\n• Accept that losses are part of trading\n\nRemember: Protecting capital is more important than chasing gains. A 50% loss requires a 100% gain to recover!",
      timestamp: new Date(),
    }
  };

  const getAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(aiResponses)) {
      const keywords = key.split('|');
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return { ...response, id: Date.now().toString() };
      }
    }
    
    return { ...aiResponses.default, id: Date.now().toString() };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage = getAIResponse(input);
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const getSentimentBadge = (sentiment?: 'bullish' | 'bearish' | 'neutral') => {
    if (!sentiment) return null;
    
    const colors = {
      bullish: 'bg-green-500/10 text-green-400 border-green-500/30',
      bearish: 'bg-red-500/10 text-red-400 border-red-500/30',
      neutral: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    };

    const icons = {
      bullish: <TrendingUp className="w-3 h-3" />,
      bearish: <AlertTriangle className="w-3 h-3" />,
      neutral: <Lightbulb className="w-3 h-3" />
    };

    return (
      <Badge variant="outline" className={`${colors[sentiment]} flex items-center gap-1`}>
        {icons[sentiment]}
        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
      </Badge>
    );
  };

  const quickQuestions = [
    "Should I buy NVDA right now?",
    "How should I diversify my portfolio?",
    "What's your take on Apple stock?",
    "When should I sell my Tesla shares?",
    "How do I manage risk better?"
  ];

  return (
    <div className="h-full flex flex-col p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-purple-400">AI Trading Advisor</h2>
        <p className="text-muted-foreground mt-1">Get personalized insights and guidance for your investments</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Area */}
        <Card className="flex-1 flex flex-col bg-card border-border">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-primary' 
                    : 'bg-gradient-to-br from-primary to-purple-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-white ml-auto'
                      : 'bg-muted/50 text-foreground'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.stocks && message.stocks.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {message.stocks.map((stock) => (
                          <Badge key={stock} variant="secondary" className="text-xs">
                            {stock}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {message.sentiment && (
                      <div className="mt-3">
                        {getSentimentBadge(message.sentiment)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about stocks, trading strategies, or your portfolio..."
                className="flex-1"
              />
              <Button onClick={handleSend} className="px-6">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Questions Sidebar */}
        <Card className="w-80 p-6 bg-card border-border">
          <h3 className="font-semibold text-purple-400 mb-4">Quick Questions</h3>
          <div className="space-y-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm text-foreground"
              >
                {question}
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-sm text-foreground mb-2">💡 Did you know?</h4>
            <p className="text-xs text-muted-foreground">
              I analyze your questions against your personal risk profile (moderate), investment goals (growth), and trading style (swing) to provide tailored advice.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
