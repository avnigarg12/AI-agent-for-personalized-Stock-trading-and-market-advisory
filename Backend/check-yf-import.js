
import YahooFinance from 'yahoo-finance2';
import { YahooFinance as YahooFinanceClass } from 'yahoo-finance2';

console.log("Default Import:", typeof YahooFinance);
console.log("Named Import:", typeof YahooFinanceClass);

const yf1 = new YahooFinance();
const yf2 = new YahooFinanceClass();

async function test() {
    try {
        console.log("Testing Default...");
        const res1 = await yf1.quote(['AAPL']);
        console.log("Default Success:", res1.length);
    } catch (e) {
        console.log("Default Failed:", e.message);
    }

    try {
        console.log("Testing Named...");
        const res2 = await yf2.quote(['AAPL']);
        console.log("Named Success:", res2.length);
    } catch (e) {
        console.log("Named Failed:", e.message);
    }
}

test();
