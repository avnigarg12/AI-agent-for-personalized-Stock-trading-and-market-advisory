import Trade from "../models/Trade.js";

// Create a new trade
export const createTrade = async (req, res) => {
    try {
        const { entryPrice, exitPrice, quantity } = req.body;

        // calculate profit
        const profit = (exitPrice - entryPrice) * quantity;

        const trade = new Trade({
            ...req.body,
            profit,
        });

        await trade.save();

        res.status(201).json(trade);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all trades
export const getTrades = async (req, res) => {
    try {
        const trades = await Trade.find();
        res.json(trades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTradeStats = async (req, res) => {
    try {
        const trades = await Trade.find();

        const totalTrades = trades.length;

        const totalProfit = trades.reduce((acc, trade) => {
            return acc + (trade.profit || 0);
        }, 0);

        const winningTrades = trades.filter(trade => trade.profit > 0).length;

        const winRate = totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;

        res.json({
            totalTrades,
            totalProfit,
            winRate: winRate.toFixed(2)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};