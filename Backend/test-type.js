import yahooFinance from 'yahoo-finance2';
console.log('Type:', typeof yahooFinance);
console.log('Keys:', Object.keys(yahooFinance));
console.log('Is instance?', !!yahooFinance.quote);
