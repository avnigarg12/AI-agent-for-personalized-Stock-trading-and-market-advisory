
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function test() {
    try {
        console.log("Fetching live INFY.NS...");
        const quote = await yahooFinance.quote('INFY.NS');
        console.log("Symbol:", quote.symbol);
        console.log("Currency:", quote.currency);
        console.log("Exchange:", quote.exchange || quote.fullExchangeName);
        console.log("Price:", quote.regularMarketPrice);
        console.log("ShortName:", quote.shortName);
    } catch (e) {
        console.error("YF API Error:", e.message);
    }
}
test();
