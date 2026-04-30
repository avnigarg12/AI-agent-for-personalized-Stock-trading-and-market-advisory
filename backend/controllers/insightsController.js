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

exports.getAIInsights = async (req, res) => {
    try {
        // Step 1: Fetch live market data via the Python/yfinance service
        let stockData = [];
        try {
            const result = await aiIntegrationService.getMarketDataAction('trending');
            if (result.success && Array.isArray(result.data)) {
                // Pick top 5 stocks with valid prices
                stockData = result.data
                    .filter(s => s.price && s.changePercent !== undefined)
                    .slice(0, 5)
                    .map(s => ({
                        symbol: s.symbol,
                        name: s.name,
                        price: s.price,
                        changePercent: parseFloat(s.changePercent).toFixed(2),
                        volume: s.volume,
                        sector: s.sector,
                        pe: s.pe_ratio,
                        beta: s.beta,
                        volatility: s.volatility ? (s.volatility * 100).toFixed(1) : null
                    }));
            }
        } catch (err) {
            console.warn('Could not fetch live market data for insights, using fallback:', err.message);
        }

        // Fallback if data fetch failed
        if (stockData.length === 0) {
            stockData = [
                { symbol: 'AAPL', name: 'Apple Inc.', price: 175, changePercent: '0.68', sector: 'Technology' },
                { symbol: 'NVDA', name: 'NVIDIA', price: 726, changePercent: '2.17', sector: 'Technology' },
                { symbol: 'TSLA', name: 'Tesla', price: 181, changePercent: '-1.87', sector: 'Automotive' }
            ];
        }

        // Step 2: Build the Gemini prompt with real data
        const stockSummary = stockData
            .map(s => `${s.symbol} (${s.name}): Price $${s.price}, Change ${s.changePercent}%, Sector: ${s.sector}${s.volatility ? ', Volatility: ' + s.volatility + '%' : ''}${s.pe ? ', P/E: ' + s.pe : ''}`)
            .join('\n');

        const prompt = `You are a professional stock market AI analyst. Based on the following REAL-TIME market data from today, generate exactly 4 actionable market insights in JSON format.

LIVE MARKET DATA:
${stockSummary}

Generate a JSON array with exactly 4 insights. Each insight must have:
- "id": string (1, 2, 3, 4)
- "type": one of "opportunity", "warning", "tip", "alert"
- "title": short punchy title (max 6 words)
- "message": 2-3 sentence analysis that references specific stocks and their actual prices/changes from the data above. Be specific and actionable.
- "stocks": array of stock symbols mentioned (can be empty)

Use each type exactly once. Make the insights genuinely useful based on the actual numbers provided. Reference real prices and percentage changes.

Respond ONLY with valid JSON array, no markdown, no explanation.`;

        // Step 3: Call Groq API via REST
        const { text, model: usedModel } = await callGroq(prompt);
        console.log(`Groq insights generated using model: ${usedModel}`);

        // Step 4: Parse and validate the response
        let insights;
        try {
            // Strip any markdown code fences if present
            const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            insights = JSON.parse(cleaned);

            // Validate structure
            if (!Array.isArray(insights) || insights.length === 0) {
                throw new Error('Invalid insights format');
            }

            // Ensure required fields
            insights = insights.map((item, idx) => ({
                id: item.id || String(idx + 1),
                type: item.type || 'tip',
                title: item.title || 'Market Update',
                message: item.message || 'No analysis available.',
                timestamp: 'Just now',
                stocks: Array.isArray(item.stocks) ? item.stocks : []
            }));

        } catch (parseError) {
            console.error('Failed to parse Groq response:', text);
            throw new Error('AI returned invalid JSON');
        }

        res.json({ success: true, insights, generatedAt: new Date().toISOString() });

    } catch (error) {
        console.error('Error generating AI insights:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to generate AI insights',
            details: error.message
        });
    }
};
