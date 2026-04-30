const aiIntegrationService = require('../services/aiIntegrationService');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function callGroq(prompt) {
    if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY is not defined in .env');
    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error?.message || `Groq API Error: ${res.status}`);
        }

        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (!text) throw new Error('Empty response from Groq');
        return { text, model: 'llama-3.3-70b-versatile' };
    } catch (err) {
        console.warn(`Groq API threw error:`, err.message);
        throw err;
    }
}

// Stock-domain keywords for server-side validation
const STOCK_KEYWORDS = [
    'stock', 'share', 'equity', 'market', 'portfolio', 'invest', 'trade', 'trading',
    'buy', 'sell', 'hold', 'nifty', 'sensex', 'nasdaq', 'dow', 's&p', 'etf', 'fund',
    'dividend', 'earnings', 'revenue', 'profit', 'loss', 'price', 'chart', 'trend',
    'sector', 'bull', 'bear', 'volatility', 'risk', 'return', 'ipo', 'bond', 'crypto',
    'bitcoin', 'reliance', 'tata', 'infosys', 'hdfc', 'tesla', 'apple', 'analyze',
    'google', 'amazon', 'microsoft', 'analysis', 'forecast', 'prediction', 'hedge',
    'mutual fund', 'sip', 'index', 'futures', 'options', 'derivative', 'commodity',
    'gold', 'silver', 'oil', 'currency', 'forex', 'exchange', 'broker', 'bse', 'nse',
    'financial', 'finance', 'asset', 'wealth', 'capital', 'gains', 'recession',
    'inflation', 'interest rate', 'fed', 'rbi', 'gdp', 'economy', 'economic',
    'suggest', 'risky', 'holdings', 'performing', 'portfolio down', 'rebalance',
    'allocation', 'diversif', 'intraday', 'swing', 'position', 'exposure', 'pe ratio',
    'moving average', 'rsi', 'macd', 'support', 'resistance', 'breakout'
];

function isStockRelated(question) {
    const lower = question.toLowerCase();
    return STOCK_KEYWORDS.some(kw => lower.includes(kw));
}

// Smart fallback when Gemini quota is exhausted — generates personalized rule-based answers
function generateFallbackResponse(question, userProfile, holdings, stockData) {
    const lower = question.toLowerCase();
    const risk = userProfile?.risk_preference || 'medium';
    const horizon = userProfile?.investment_horizon || 'long';
    const goal = userProfile?.financial_goal || 'wealth building';
    const hasHoldings = holdings && holdings.length > 0;

    // Extract stock ticker mentioned in the question (basic heuristic)
    const mentionedTicker = (question.match(/\b([A-Z]{2,5})\b/) || [])[1] || null;
    const mentionedCompany = lower.match(/(reliance|ril|tata|infosys|hdfc|tesla|apple|google|amazon|microsoft|nvidia|nvda|infy)/)?.[1] || null;

    // -- Buy / Should I invest? --
    if (/buy|should i|invest in|worth buying/i.test(question)) {
        const ticker = mentionedTicker || mentionedCompany?.toUpperCase() || 'that stock';
        const liveStock = stockData.find(s => s.symbol === ticker || lower.includes(s.symbol?.toLowerCase()));
        const riskAdvice = risk === 'low' ? 'limit it to 3-5% of your portfolio' : risk === 'high' ? 'you could allocate up to 10-15%' : 'aim for 5-8% allocation';
        const horizonAdvice = horizon === 'short' ? 'Given your short-term focus, watch for near-term momentum signals.' : 'Your long-term horizon gives this time to compound.';

        const liveDetail = liveStock
            ? ` ${liveStock.symbol} is currently at $${liveStock.price} (${liveStock.changePercent > 0 ? '+' : ''}${liveStock.changePercent}% today).`
            : '';

        return {
            answer: `Based on your ${risk} risk profile and ${goal} goal,${liveDetail} this could be a reasonable entry point — ${riskAdvice} to manage downside. ${horizonAdvice} Always deploy capital in tranches rather than a lump sum to benefit from price averaging.`,
            stocks: mentionedTicker ? [mentionedTicker] : [],
            structuredData: {
                recommendation: risk === 'low' ? 'Hold' : 'Buy',
                confidenceScore: risk === 'high' ? 72 : 65,
                keyReasons: [
                    `Your ${risk} risk tolerance ${risk === 'low' ? 'suggests cautious entry' : 'supports growth positions'}`,
                    liveStock ? `Current price $${liveStock.price} with ${liveStock.changePercent}% daily change` : 'Monitor entry price carefully',
                    `${horizon === 'long' ? 'Long-term horizon allows riding short-term volatility' : 'Short-term focus requires tight stop-losses'}`
                ],
                riskLevel: risk === 'low' ? 'Low' : risk === 'high' ? 'High' : 'Medium',
                suggestedAllocation: riskAdvice
            }
        };
    }

    // -- Sell / Exit? --
    if (/sell|exit|liquidate|book profit|take profit/i.test(question)) {
        const winnerHolding = hasHoldings ? holdings.filter(h => h.gainLossPercent > 0).sort((a, b) => b.gainLossPercent - a.gainLossPercent)[0] : null;
        const loserHolding = hasHoldings ? holdings.filter(h => h.gainLossPercent < -10)[0] : null;

        if (winnerHolding) {
            return {
                answer: `Your ${winnerHolding.symbol} is up ${winnerHolding.gainLossPercent.toFixed(1)}% from your avg cost of $${winnerHolding.avgCost?.toFixed(2)}. With a ${risk} risk profile, consider taking partial profits — sell 30-50% to lock in gains while keeping the rest to ride further upside. Avoid exiting fully unless there's a fundamental reason to.`,
                stocks: [winnerHolding.symbol],
                structuredData: {
                    recommendation: 'Hold',
                    confidenceScore: 70,
                    keyReasons: [`Currently +${winnerHolding.gainLossPercent.toFixed(1)}% unrealized gain`, 'Partial profit-taking balances reward and upside retention', `${horizon === 'long' ? 'Long-term horizon supports holding' : 'Short-term: tighter stop recommended'}`],
                    riskLevel: risk === 'low' ? 'Low' : 'Medium',
                    suggestedAllocation: 'Consider selling 30-50% to lock in gains'
                }
            };
        }
        if (loserHolding) {
            return {
                answer: `${loserHolding.symbol} is down ${Math.abs(loserHolding.gainLossPercent).toFixed(1)}% from your entry of $${loserHolding.avgCost?.toFixed(2)}. With a ${risk} risk tolerance, evaluate whether the fundamentals have changed. If you're down purely due to market volatility and the thesis is intact, holding or averaging down may be better than selling at a loss.`,
                stocks: [loserHolding.symbol],
                structuredData: {
                    recommendation: 'Hold',
                    confidenceScore: 62,
                    keyReasons: [`Down ${Math.abs(loserHolding.gainLossPercent).toFixed(1)}% from entry`, 'Panic-selling at lows locks in losses unnecessarily', 'Re-evaluate the original investment thesis before exiting'],
                    riskLevel: 'Medium',
                    suggestedAllocation: 'Review before exiting — consider stop-loss at -15%'
                }
            };
        }
        return {
            answer: `When considering selling, the key is your original investment thesis. If the reason you bought the stock no longer holds — company fundamentals changed, sector is declining, or you've hit your target — then selling makes sense. For your ${risk} risk profile: use trailing stop-losses at 8-12% to automate exit decisions without emotional bias.`,
            stocks: [],
            structuredData: null
        };
    }

    // -- Portfolio analysis --
    if (/portfolio|my holdings|my positions|overall/i.test(question)) {
        if (!hasHoldings) {
            return { answer: `You haven't added any holdings to your portfolio yet. Once you add stocks, I can give you a full breakdown of risk, diversification, sector exposure, and personalized buy/sell/hold recommendations tailored to your ${risk} risk profile and ${goal} goal.`, stocks: [], structuredData: null };
        }
        const totalValue = holdings.reduce((s, h) => s + (h.totalValue || 0), 0);
        const winners = holdings.filter(h => h.gainLossPercent > 0);
        const losers = holdings.filter(h => h.gainLossPercent < 0);
        const biggestGainer = winners.sort((a, b) => b.gainLossPercent - a.gainLossPercent)[0];
        const biggestLoser = losers.sort((a, b) => a.gainLossPercent - b.gainLossPercent)[0];

        return {
            answer: `Your portfolio of ${holdings.length} positions is worth approximately $${totalValue.toFixed(0)}. You have ${winners.length} winner(s) and ${losers.length} loser(s). ${biggestGainer ? `Top performer: ${biggestGainer.symbol} at +${biggestGainer.gainLossPercent.toFixed(1)}%.` : ''} ${biggestLoser ? `Biggest drag: ${biggestLoser.symbol} at ${biggestLoser.gainLossPercent.toFixed(1)}%.` : ''} For a ${risk}-risk investor with a ${horizon}-term horizon, ${risk === 'low' ? 'consider rebalancing any position exceeding 15% of total portfolio' : 'ensure no single stock is more than 20-25% of your total value'}.`,
            stocks: holdings.map(h => h.symbol),
            structuredData: null
        };
    }

    // -- Risk / Risky? --
    if (/risk|risky|safe|volatile|volatility|hedge/i.test(question)) {
        const highVol = stockData.filter(s => s.volatility && parseFloat(s.volatility) > 25);
        return {
            answer: `With a ${risk} risk appetite and a ${horizon} investment horizon, your risk tolerance is ${risk === 'low' ? 'conservative — stick to large-cap, dividend-paying stocks and limit single-stock exposure to <5%' : risk === 'high' ? 'aggressive — you can handle volatility but should use stop-losses and position limits of 15% max' : 'moderate — diversify across 8-12 stocks and use sector caps of 25% per sector'}. ${highVol.length > 0 ? `Currently volatile stocks in the market include: ${highVol.map(s => s.symbol).join(', ')}.` : ''} Regular portfolio rebalancing quarterly helps manage drift.`,
            stocks: highVol.map(s => s.symbol),
            structuredData: null
        };
    }

    // -- Market trends / Sectors --
    if (/sector|market|trend|performing|week|today|outlook/i.test(question)) {
        if (stockData.length > 0) {
            const gainers = stockData.filter(s => parseFloat(s.changePercent) > 0).sort((a, b) => b.changePercent - a.changePercent);
            const losers = stockData.filter(s => parseFloat(s.changePercent) < 0);
            return {
                answer: `Based on live market data: ${gainers.length > 0 ? `${gainers.slice(0, 2).map(s => `${s.symbol} (+${s.changePercent}%)`).join(', ')} are leading gainers today.` : ''} ${losers.length > 0 ? `${losers.slice(0, 1).map(s => `${s.symbol} (${s.changePercent}%)`).join(', ')} is pulling back.` : ''} For your ${risk} risk profile, ${gainers[0]?.sector === 'Technology' ? 'tech continues to drive market momentum' : 'watch sector rotation patterns carefully'}. ${horizon === 'long' ? 'Short-term noise matters less for your long-term strategy.' : 'Consider intraday support levels before entering.'}`,
                stocks: stockData.slice(0, 3).map(s => s.symbol),
                structuredData: null
            };
        }
        return { answer: `Market trends show ongoing sector rotation. Technology and energy remain key themes. For your ${risk} risk and ${goal} goal, focus on high-quality companies with strong earnings growth. Monitor macroeconomic indicators like Fed rate decisions and inflation data as they directly impact equity valuations.`, stocks: [], structuredData: null };
    }

    // -- Generic fallback --
    return {
        answer: `Great question! As your TradeMind AI advisor with your ${risk} risk profile and ${goal} goal in mind: the most important thing in investing is consistency and discipline. ${hasHoldings ? `With ${holdings.length} positions in your portfolio, ensure you're diversified across at least 3-4 sectors.` : 'Building a diversified portfolio across sectors is step one.'} ${stockData.length > 0 ? `Live markets show ${stockData[0]?.symbol} at $${stockData[0]?.price} today.` : ''} Feel free to ask me about specific stocks, your portfolio, or market trends for a more targeted analysis.`,
        stocks: stockData.slice(0, 2).map(s => s.symbol),
        structuredData: null
    };
}

exports.chatWithAdvisor = async (req, res) => {
    try {
        const { question, userProfile, holdings } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({ success: false, error: 'Question is required.' });
        }

        // --- Server-side domain check ---
        if (!isStockRelated(question)) {
            return res.json({
                success: true,
                answer: "⚠️ I'm sorry, but that question is outside my area of expertise.\n\nI'm a specialized **AI Trading Advisor** focused exclusively on:\n• 📈 Stock analysis & recommendations\n• 💼 Portfolio management & optimization\n• 📊 Market trends & sector insights\n• ⚖️ Risk assessment & investment strategy\n\nPlease ask me something related to **stocks, markets, or your investment portfolio** and I'll be happy to help!",
                stocks: [],
                structuredData: null
            });
        }

        // --- Fetch live market data ---
        let stockData = [];
        try {
            const result = await aiIntegrationService.getMarketDataAction('trending');
            if (result.success && Array.isArray(result.data)) {
                stockData = result.data
                    .filter(s => s.price && s.changePercent !== undefined)
                    .slice(0, 6)
                    .map(s => ({
                        symbol: s.symbol,
                        name: s.name,
                        price: s.price,
                        changePercent: parseFloat(s.changePercent).toFixed(2),
                        sector: s.sector,
                        pe: s.pe_ratio,
                        volatility: s.volatility ? (s.volatility * 100).toFixed(1) : null
                    }));
            }
        } catch (err) {
            console.warn('Could not fetch live market data for advisor, proceeding without it:', err.message);
        }

        // --- Build profile section ---
        let profileSection = 'No profile available.';
        if (userProfile) {
            profileSection = [
                userProfile.risk_preference ? `- Risk Preference: ${userProfile.risk_preference}` : null,
                userProfile.investment_horizon ? `- Investment Horizon: ${userProfile.investment_horizon}` : null,
                userProfile.financial_goal ? `- Financial Goal: ${userProfile.financial_goal}` : null,
                userProfile.investment_amount ? `- Investment Amount: ₹${userProfile.investment_amount}` : null,
                userProfile.monthly_income ? `- Monthly Income: ₹${userProfile.monthly_income}` : null,
                userProfile.age ? `- Age: ${userProfile.age}` : null,
            ].filter(Boolean).join('\n');
        }

        // --- Build holdings section ---
        let holdingsSection = 'No holdings data available.';
        if (holdings && Array.isArray(holdings) && holdings.length > 0) {
            holdingsSection = holdings.map(h => {
                const gain = h.gainLossPercent !== undefined ? `${h.gainLossPercent > 0 ? '+' : ''}${h.gainLossPercent.toFixed(2)}%` : 'N/A';
                return `- ${h.symbol}: ${h.shares} shares @ $${h.avgCost?.toFixed(2)} avg (Current: $${h.currentPrice?.toFixed(2)}, Gain/Loss: ${gain})`;
            }).join('\n');
        }

        // --- Build live market data section ---
        let marketSection = 'Live market data unavailable.';
        if (stockData.length > 0) {
            marketSection = stockData.map(s =>
                `- ${s.symbol} (${s.name}): $${s.price}, ${s.changePercent > 0 ? '+' : ''}${s.changePercent}%, Sector: ${s.sector}${s.volatility ? ', Volatility: ' + s.volatility + '%' : ''}${s.pe ? ', P/E: ' + s.pe : ''}`
            ).join('\n');
        }

        // --- Determine if the question is about a specific stock for structured response ---
        const wantsStructured = /buy|sell|hold|should i|recommend|invest in|worth|good stock|analysis|analyze/i.test(question);

        // --- Build Gemini prompt ---
        const prompt = `You are TradeMind AI, a personalized and empathetic stock trading advisor. You ONLY answer questions related to stocks, markets, and personal investing.

USER PROFILE:
${profileSection}

USER PORTFOLIO HOLDINGS:
${holdingsSection}

LIVE MARKET DATA (fetched right now):
${marketSection}

USER QUESTION: "${question.trim()}"

INSTRUCTIONS:
1. Answer the user's question directly, referencing their specific profile, holdings, and live market data above.
2. Be conversational, clear, and concise (3–6 sentences). Not robotic.
3. Use actual numbers from the data above (prices, percentages) wherever relevant.
4. Only discuss stocks, finance, or investing topics. If unrelated, politely decline.
5. Do NOT add generic disclaimers like "this is not financial advice" — the user already knows.

${wantsStructured ? `6. Because this question is about a specific action (buy/sell/hold/recommend), respond ONLY with a strict JSON object:
{
  "answer": "<clear conversational explanation mentioning their profile and actual market data>",
  "stocks": ["<ticker symbols mentioned>"],
  "structuredData": {
    "recommendation": "<Buy | Hold | Avoid>",
    "confidenceScore": <number 50-95>,
    "keyReasons": ["<reason 1>", "<reason 2>", "<reason 3>"],
    "riskLevel": "<Low | Medium | High>",
    "suggestedAllocation": "<e.g. 5-10% of portfolio or specific advice>",
    "sentiment": "<bullish | bearish | neutral>"
  }
}
Respond ONLY with the JSON object, no markdown fences, no extra text.` :
                `6. Respond ONLY with a JSON object:
{
  "answer": "<your conversational response>",
  "stocks": ["<any ticker symbols mentioned, or empty array>"],
  "structuredData": null
}
Respond ONLY with the JSON object, no markdown fences, no extra text.`}`;

        // --- Call Gemini ---
        let parsed;
        try {
            const { text, model: usedModel } = await callGroq(prompt);
            console.log(`[AdvisorChat] Groq response via model: ${usedModel}`);

            try {
                const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                parsed = JSON.parse(cleaned);
            } catch (parseErr) {
                console.warn('[AdvisorChat] Non-JSON response from Groq, wrapping as plain answer.');
                parsed = { answer: text.trim(), stocks: [], structuredData: null };
            }
        } catch (groqError) {
            // Groq quota exhausted — use smart rule-based fallback
            console.warn('[AdvisorChat] Groq unavailable, using smart fallback:', groqError.message);
            parsed = generateFallbackResponse(question, userProfile, holdings, stockData);
        }

        return res.json({
            success: true,
            answer: parsed.answer || 'I was unable to generate a response. Please try again.',
            stocks: Array.isArray(parsed.stocks) ? parsed.stocks : [],
            structuredData: parsed.structuredData || null
        });

    } catch (error) {
        console.error('[AdvisorChat] Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to generate advisor response',
            details: error.message
        });
    }
};
