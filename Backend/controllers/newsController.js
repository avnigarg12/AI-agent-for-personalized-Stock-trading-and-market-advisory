
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

/**
 * AI INTEGRATOR: Use this function to connect your AI Model (Gemini/OpenAI/etc.)

 * This function should take a headline and return sentiment + recommendation.
 */
const analyzeSentiment = async (headline) => {
    // 1. Call your AI model here
    // 2. Return the analysis
    return {
        sentiment: "neutral", // Change to "positive" or "negative" via AI
        recommendation: "HOLD", // Change to "BUY" or "SELL" via AI
        impact: "Analysis Pending..."
    };
};

/**
 * Fetches real-time news for a specific stock or the general market.
 */
export const getMarketNews = async (req, res) => {
    try {
        const { symbol } = req.query;
        const query = symbol || 'market news';
        
        console.log(`📡 Fetching live news for: ${query}...`);
        const result = await yahooFinance.search(query);
        
        if (!result.news || result.news.length === 0) {
            return res.json([]);
        }

        // Map Yahoo news and prepare for AI sentiment
        const news = await Promise.all(result.news.map(async (article) => {
            // The AI Integrator will uncomment the line below to enable sentiment:
            // const analysis = await analyzeSentiment(article.title);

            return {
                id: article.uuid,
                title: article.title,
                summary: article.publisher || "Finance News",
                source: article.publisher || "Yahoo Finance",
                timestamp: new Date(article.providerPublishTime).toLocaleString(),
                link: article.link,
                sentiment: "neutral" // AI Integrator: replace with analysis.sentiment
            };
        }));

        console.log(`✅ Successfully fetched ${news.length} articles.`);
        res.json(news);
    } catch (error) {

        console.error("❌ Error fetching news:", error.message);
        res.status(500).json({ error: "Failed to fetch real-time news" });
    }
};
