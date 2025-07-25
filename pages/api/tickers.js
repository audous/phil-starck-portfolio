import dbConnect from "../../lib/dbConnect";
import Ticker from "../../models/Ticker";

export default async function handler(req, res) {
  await dbConnect();
  const tickers = await Ticker.find({}, "symbol name")
    .sort({ symbol: 1 })
    .lean();
  res.status(200).json({ tickers });
}
