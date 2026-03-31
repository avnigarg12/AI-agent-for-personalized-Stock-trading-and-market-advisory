
import yahooFinance from 'yahoo-finance2';
console.log("Type of default:", typeof yahooFinance);
try {
    const test = new yahooFinance();
    console.log("It is a constructor!");
} catch (e) {
    console.log("It is NOT a constructor:", e.message);
}
if (typeof yahooFinance.quote === 'function') {
    console.log("It is an instance/object with quote()!");
}
