import yahooFinance from 'yahoo-finance2';
console.log("Default export type:", typeof yahooFinance);
console.log("Is it an instance?", !!yahooFinance.quote);

import { YahooFinance } from 'yahoo-finance2';
console.log("Named YahooFinance type:", typeof YahooFinance);
