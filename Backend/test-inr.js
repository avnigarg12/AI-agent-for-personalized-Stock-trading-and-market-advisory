
import yahooFinance from 'yahoo-finance2';

async function test() {
    try {
        const quote = await yahooFinance.quote('INFY.NS');
        console.log("Symbol:", quote.symbol);
        console.log("Currency:", quote.currency);
        console.log("Price:", quote.regularMarketPrice);
    } catch (e) {
        console.log("Error:", e.message);
    }
}
test();
