
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function testNews() {
    try {
        console.log("Searching news for AAPL...");
        const result = await yahooFinance.search('AAPL');
        console.log("News count:", result.news?.length || 0);
        if (result.news && result.news.length > 0) {
            console.log("First article:", JSON.stringify(result.news[0], null, 2));
        }
    } catch (e) {
        console.log("Error:", e.message);
    }
}
testNews();
