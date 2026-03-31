import { quote } from 'yahoo-finance2';
console.log('Quote function type:', typeof quote);

async function run() {
  try {
    const quotes = await quote(['AAPL', 'NVDA']);
    console.log('Success!', quotes.map(q => q.symbol));
  } catch (e) {
    console.error('Final Error:', e.message);
  }
}
run();
