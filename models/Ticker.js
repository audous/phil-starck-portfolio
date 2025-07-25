import mongoose from "mongoose";

const TickerSchema = new mongoose.Schema(
  {
    symbol: { type: String, unique: true },
    name: String,
  },
  { timestamps: true }
);

export default mongoose.models.Ticker || mongoose.model("Ticker", TickerSchema);
