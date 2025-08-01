// pages/api/tickers.js
import dbConnect from "../../lib/dbConnect";
import Ticker from "../../models/Ticker";

export default async function handler(req, res) {
  await dbConnect();
  const { search = "" } = req.query;
  const filter = search
    ? {
        $or: [
          { symbol: { $regex: `^${search}`, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const tickers = await Ticker.find(filter, "symbol name")
    .sort({ symbol: 1 })
    .limit(100)
    .lean();

  res.status(200).json({ tickers });
}
