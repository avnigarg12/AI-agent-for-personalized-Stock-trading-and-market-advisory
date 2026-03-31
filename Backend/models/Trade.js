import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
    },
    entryPrice: {
        type: Number,
        required: true,
    },
    exitPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    tradeType: {
        type: String,
        enum: ["buy", "sell"],
        required: true,
    },
    profit: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Trade", tradeSchema);