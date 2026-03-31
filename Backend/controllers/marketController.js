import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

// Mixed list of US and Indian stocks (Using .NS for Indian stocks to get INR)
const TRENDING_SYMBOLS = ['AAPL', 'NVDA', 'RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'TSLA'];

// Mock data with currency support
const MOCK_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 1.25, changePercent: 0.68, volume: 52000000, marketCap: 2800000000000, pe: 29.5, sector: 'Technology', currency: 'USD' },
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries Limited', price: 2950.45, change: 45.20, changePercent: 1.55, volume: 5000000, marketCap: 20000000000000, pe: 25.8, sector: 'Energy', currency: 'INR' },
    { symbol: 'INFY.NS', name: 'Infosys Limited', price: 1250.60, change: 12.30, changePercent: 0.98, volume: 8000000, marketCap: 8000000000000, pe: 24.5, sector: 'Technology', currency: 'INR' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 726.13, change: 15.42, changePercent: 2.17, volume: 44000000, marketCap: 1800000000000, pe: 95.2, sector: 'Technology', currency: 'USD' },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: 4120.10, change: -12.30, changePercent: -0.30, volume: 2000000, marketCap: 15000000000000, pe: 30.2, sector: 'Technology', currency: 'INR' }
];

// Helper to map Yahoo Finance quote to our frontend Stock interface
const mapQuoteToStock = (quote) => {
    let currency = quote.currency || "USD";
    
    // Explicitly check for Indian exchanges if currency is missing or incorrect
    if (quote.symbol.endsWith('.NS') || quote.symbol.endsWith('.BO')) {
        currency = 'INR';
    }

    return {
        symbol: quote.symbol,
        name: quote.shortName || quote.longName || quote.symbol,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        volume: quote.regularMarketVolume || 0,
        marketCap: quote.marketCap || 0,
        pe: quote.forwardPE || quote.trailingPE || 0,
        sector: quote.sector || "General",
        currency: currency.toUpperCase() // Ensure it's always uppercase (INR/USD)
    };
};


export const getTrendingStocks = async (req, res) => {
    try {
        console.log("📡 Fetching mixed US & Indian stocks...");
        const quotes = await yahooFinance.quote(TRENDING_SYMBOLS);
        const stocks = Array.isArray(quotes) ? quotes.map(mapQuoteToStock) : [mapQuoteToStock(quotes)];
        console.log(`✅ Successfully fetched ${stocks.length} stocks.`);
        res.json(stocks);
    } catch (error) {
        console.warn("⚠️ API fallback: Using mixed Mock Data:", error.message);
        res.json(MOCK_STOCKS);
    }
};






export const getStockQuote = async (req, res) => {
    try {
        const { symbol } = req.params;
        const quote = await yahooFinance.quote(symbol);
        
        if (!quote) {
            return res.status(404).json({ error: "Stock not found" });
        }

        const stock = mapQuoteToStock(quote);
        res.json(stock);
    } catch (error) {
        console.error(`Error fetching quote for ${req.params.symbol}:`, error);
        res.status(500).json({ error: "Failed to fetch stock quote" });
    }
};

export const getMultipleQuotes = async (req, res) => {
    try {
        const { symbols } = req.query;
        if (!symbols) {
            return res.status(400).json({ error: "No symbols provided" });
        }
        
        const symbolArray = symbols.split(',').map(s => s.trim().toUpperCase());
        const quotes = await yahooFinance.quote(symbolArray);
        
        const stocks = quotes.map(mapQuoteToStock);
        res.json(stocks);
    } catch (error) {
        console.error(`Error fetching multiple quotes:`, error);
        res.status(500).json({ error: "Failed to fetch quotes" });
    }
};

export const getStockHistory = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { timeframe = '1M' } = req.query;

        let period1 = new Date();
        let interval = '1d';

        switch(timeframe) {
            case '1D':
                // For 1D, go back 2 or 3 days to guarantee market open data, using 15m intervals
                period1.setDate(period1.getDate() - 2);
                interval = '15m';
                break;
            case '1W':
                period1.setDate(period1.getDate() - 7);
                interval = '60m';
                break;
            case '1M':
                period1.setMonth(period1.getMonth() - 1);
                interval = '1d';
                break;
            case '3M':
                period1.setMonth(period1.getMonth() - 3);
                interval = '1d';
                break;
            case '1Y':
                period1.setFullYear(period1.getFullYear() - 1);
                interval = '1wk';
                break;
            default:
                period1.setMonth(period1.getMonth() - 1);
        }

        const queryOptions = {
            period1: period1.toISOString().split('T')[0],
            interval
        };

        const chartResult = await yahooFinance.chart(symbol, queryOptions);
        
        if (!chartResult || !chartResult.quotes || chartResult.quotes.length === 0) {
            return res.json([]);
        }

        const history = chartResult.quotes
            .filter(q => q.close !== null)
            .map(q => ({
                date: q.date.toISOString(),
                price: parseFloat(q.close.toFixed(2)),
                volume: q.volume || 0
            }));

        res.json(history);
    } catch (error) {
        console.error(`Error fetching history for ${req.params.symbol}:`, error.message);
        res.status(500).json({ error: "Failed to fetch historical data" });
    }
};
