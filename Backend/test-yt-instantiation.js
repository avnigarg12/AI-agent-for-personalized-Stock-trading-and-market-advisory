import YahooFinance from 'yahoo-finance2';

console.log('YahooFinance type:', typeof YahooFinance);
try {
  const instance = new YahooFinance();
  console.log('Successfully created instance!');
  const quotes = await instance.quote(['AAPL']);
  console.log('Success! Symbol:', quotes[0].symbol);
} catch (e) {
  console.error('Error:', e.message);
  if (e.message.includes('not a constructor')) {
    console.log('It is NOT a constructor. Let try calling it directly or check .default');
    try {
      const instance2 = new YahooFinance.default();
      console.log('Successfully created instance via .default!');
    } catch (e2) {
      console.log('Still not a constructor via .default');
    }
  }
}
