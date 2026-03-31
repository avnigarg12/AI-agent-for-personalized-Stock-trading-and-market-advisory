import * as yf from 'yahoo-finance2';
console.log('Keys of import * as yf:', Object.keys(yf));
console.log('Default export type:', typeof yf.default);
if (yf.default) {
  console.log('Default export keys:', Object.keys(yf.default));
}
