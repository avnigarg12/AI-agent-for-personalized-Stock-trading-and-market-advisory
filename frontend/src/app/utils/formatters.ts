/**
 * Returns the currency symbol for a given currency code or stock ticker.
 * - Explicit currency field takes priority (comes from yfinance API response).
 * - Falls back to symbol-based detection: .NS / .BO suffix → INR, everything else → USD.
 */
export const getCurrencySymbol = (currency?: string, symbol?: string): string => {
  if (currency) {
    const c = currency.toUpperCase();
    if (c === 'INR') return '₹';
    if (c === 'USD') return '$';
    return c + ' ';
  }

  if (symbol) {
    const s = symbol.toUpperCase();
    // Indian exchanges
    if (s.endsWith('.NS') || s.endsWith('.BO')) return '₹';
    
    // If it's a standard short ticker without a dot, it's usually US (e.g., AAPL, MSFT)
    if (!s.includes('.') && s.length <= 5) return '$';
  }

  // Default to INR for global portfolio metrics (profit, investment, etc.)
  return '₹';
};

export const formatCurrency = (value: number, currency?: string, symbol?: string): string => {
  const currencySymbol = getCurrencySymbol(currency, symbol);
  const isINR = currencySymbol === '₹';

  if (isINR) {
    // Indian number formatting: Cr (crore) and L (lakh)
    if (value >= 1e12) return `₹${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e7)  return `₹${(value / 1e7).toFixed(2)}Cr`;
    if (value >= 1e5)  return `₹${(value / 1e5).toFixed(2)}L`;
    return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // USD / other currencies
  if (value >= 1e12) return `${currencySymbol}${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9)  return `${currencySymbol}${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6)  return `${currencySymbol}${(value / 1e6).toFixed(2)}M`;
  return `${currencySymbol}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
