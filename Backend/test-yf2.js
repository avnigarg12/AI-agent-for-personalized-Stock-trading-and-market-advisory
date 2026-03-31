import { YahooFinance } from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function run() {
    try {
        const quotes = await yahooFinance.quote(['AAPL', 'NVDA', 'MSFT', 'TSLA', 'GOOGL', 'AMZN']);
        console.log("Success", quotes.map(q => q.symbol));
    } catch (e) {
        console.error("YF Error:", e);
    }
}
run();
run();
