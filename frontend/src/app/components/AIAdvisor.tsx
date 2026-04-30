import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Bot, User, Lightbulb, Activity, Target, ShieldAlert } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { API_ENDPOINTS } from "../apiConfig";

interface StructuredData {
  recommendation: 'Buy' | 'Hold' | 'Avoid';
  confidenceScore: number;
  keyReasons: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  suggestedAllocation?: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  stocks?: string[];
  structuredData?: StructuredData;
  isTyping?: boolean;
}

export function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Trading Advisor powered by Gemini. I've synced with your portfolio and live market data.\n\nFeel free to ask me **anything** about stocks, your portfolio, market trends, or investing strategy. I'll give you a personalized, real-time answer based on your profile.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user profile and portfolio holdings from localStorage (set during onboarding/portfolio)
  const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);
  const [holdings, setHoldings] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    try {
      const profileStr = localStorage.getItem('investorProfile');
      if (profileStr) setUserProfile(JSON.parse(profileStr));

      const portfolioStr = localStorage.getItem('user_portfolio');
      if (portfolioStr) setHoldings(JSON.parse(portfolioStr));
    } catch {
      // silently ignore parse errors
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    if (text === input) setInput("");
    setIsLoading(true);

    // Add typing indicator bubble
    const typingId = `typing-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: typingId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true
    }]);

    try {
      const response = await fetch(`${API_ENDPOINTS.ADVISOR}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text.trim(),
          userProfile,
          holdings
        })
      });

      const data = await response.json();

      // Remove typing indicator and add real response
      setMessages(prev => {
        const withoutTyping = prev.filter(m => m.id !== typingId);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.answer || "I'm sorry, I couldn't generate a response. Please try again.",
          timestamp: new Date(),
          stocks: data.stocks || [],
          structuredData: data.structuredData || undefined,
        };
        return [...withoutTyping, aiMessage];
      });
    } catch {
      // Remove typing indicator and add error message
      setMessages(prev => {
        const withoutTyping = prev.filter(m => m.id !== typingId);
        return [...withoutTyping, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "⚠️ I couldn't reach the AI service right now. Please make sure the backend server is running and try again.",
          timestamp: new Date(),
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "Analyze My Portfolio", icon: <Target className="w-4 h-4 mr-2 text-blue-400" /> },
    { label: "Suggest Stocks", icon: <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" /> },
    { label: "Identify Risky Holdings", icon: <ShieldAlert className="w-4 h-4 mr-2 text-red-400" /> },
    { label: "Market Trend Summary", icon: <Activity className="w-4 h-4 mr-2 text-green-400" /> }
  ];

  const examplePrompts = [
    "Should I buy Reliance now?",
    "Why is my portfolio down today?",
    "What sectors are performing well this week?",
    "Is my portfolio too risky?"
  ];

  const renderStructuredDataCard = (data: StructuredData) => {
    const recColors = {
      Buy: 'bg-green-500/10 text-green-400 border-green-500/30',
      Hold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      Avoid: 'bg-red-500/10 text-red-400 border-red-500/30',
    };

    const riskColors = {
      Low: 'text-green-400',
      Medium: 'text-yellow-400',
      High: 'text-red-400',
    };

    return (
      <Card className="mt-4 p-5 bg-card border border-border/50 rounded-xl space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium">Recommendation:</span>
            <Badge variant="outline" className={`${recColors[data.recommendation]} px-3 py-1 font-semibold`}>
              {data.recommendation}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium">Risk Level:</span>
            <span className={`text-sm font-bold ${riskColors[data.riskLevel]}`}>{data.riskLevel}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground font-medium">AI Confidence Score</span>
            <span className="text-sm font-bold text-primary">{data.confidenceScore}%</span>
          </div>
          <Progress value={data.confidenceScore} className="h-2" />
        </div>

        <div className="space-y-2">
          <span className="text-sm text-muted-foreground font-medium">Key Reasons:</span>
          <ul className="space-y-1">
            {data.keyReasons.map((reason, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span className="text-foreground/90">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {data.suggestedAllocation && (
          <div className="pt-2 border-t border-border/50 flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">Suggested Allocation:</span>
            <span className="text-sm font-semibold">{data.suggestedAllocation}</span>
          </div>
        )}
      </Card>
    );
  };

  const renderTypingIndicator = () => (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600">
        <Bot className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 max-w-[85%]">
        <div className="rounded-2xl p-4 shadow-sm bg-muted/40 text-foreground border border-border/50 rounded-tl-none inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen h-full flex flex-col p-8 pt-0 w-full z-0">
      <style>{`
        @keyframes slideMoneyDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-money-fall {
          animation: slideMoneyDown 40s linear infinite;
        }
      `}</style>
      <div className="fixed inset-0 -z-10 bg-[#020617] dark:bg-black overflow-hidden pointer-events-none">
         <div 
           className="absolute top-0 left-0 w-full h-[200%] opacity-30 dark:opacity-40 mix-blend-screen animate-money-fall"
           style={{
             backgroundImage: "url('/falling-money-bg.png')",
             backgroundSize: '100% 50%',
             backgroundRepeat: 'repeat-y'
           }}
         />
         <div className="absolute inset-0 bg-background/80 dark:bg-background/80 backdrop-blur-[3px]" />
      </div>

      <div className="flex-1 flex gap-6 min-h-0 relative z-10 w-full max-w-[1200px] mx-auto mt-6">
        {/* Chat Area */}
        <Card className="flex-1 flex flex-col bg-card border-border shadow-md">
          {/* Quick Actions Bar */}
          <div className="p-4 border-b border-border bg-muted/20 overflow-x-auto flex gap-3 hide-scrollbar">
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="whitespace-nowrap rounded-full bg-background border-border/60 hover:bg-muted"
                onClick={() => handleSend(action.label)}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              message.isTyping ? (
                <div key={message.id}>
                  {renderTypingIndicator()}
                </div>
              ) : (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${message.role === 'user'
                      ? 'bg-primary'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                    <div className={`rounded-2xl p-4 shadow-sm ${message.role === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-muted/40 text-foreground border border-border/50 rounded-tl-none'
                      }`}>
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>

                      {message.stocks && message.stocks.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {message.stocks.map((stock) => (
                            <Badge key={stock} variant="secondary" className="text-xs bg-background">
                              {stock}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {message.structuredData && renderStructuredDataCard(message.structuredData)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 px-1 font-medium">
                      {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-muted/10 border-t border-border mt-auto">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mr-2 self-center">Try asking:</span>
              {examplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 rounded-full bg-background border border-border hover:border-primary/50 hover:text-primary transition-colors text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center bg-background border border-border focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all rounded-xl p-1.5 pl-4 shadow-sm">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder={isLoading ? "AI is thinking..." : "Ask your AI Copilot about stocks or portfolio performance..."}
                className="flex-1 border-0 focus-visible:ring-0 shadow-none bg-transparent"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSend()}
                size="icon"
                className="rounded-lg h-10 w-10 shrink-0"
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
