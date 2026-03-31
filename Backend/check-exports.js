
import * as yf from 'yahoo-finance2';
console.log("Keys:", Object.keys(yf));
console.log("Default:", typeof yf.default);
if (yf.default && typeof yf.default.quote === 'function') {
    console.log("Default has quote method!");
}
