import express from "express";
import { createTrade, getTrades, getTradeStats } from "../controllers/tradeController.js";

const router = express.Router();

router.post("/", createTrade);
router.get("/", getTrades);
router.get("/stats", getTradeStats);

export default router;