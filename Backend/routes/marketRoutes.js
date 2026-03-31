import express from "express";
import { getTrendingStocks, getStockHistory, getStockQuote, getMultipleQuotes } from "../controllers/marketController.js";
import { getMarketNews } from "../controllers/newsController.js";

const router = express.Router();

// Get predefined trending stocks
router.get("/trending", getTrendingStocks);

// Get specific stock quote
router.get("/quote/:symbol", getStockQuote);

// Get bulk stock quotes
router.get("/quotes", getMultipleQuotes);

// Get historical chart data
router.get("/history/:symbol", getStockHistory);

// Get live news articles
router.get("/news", getMarketNews);

export default router;
