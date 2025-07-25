// pages/api/update-tickers.js
import dbConnect from "../../lib/dbConnect";
import Ticker from "../../models/Ticker";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // (Optional: add admin authentication check here)
  const apiKey =
    process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY ||
    process.env.ALPHAVANTAGE_API_KEY;
  const url = `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${apiKey}`;
  try {
    await dbConnect();
    const csvRes = await fetch(url);
    const csvText = await csvRes.text();

    const lines = csvText.trim().split("\n").slice(1); // skip header
    let count = 0;
    for (const line of lines) {
      const [symbol, name] = line.split(",");
      if (symbol && name) {
        await Ticker.updateOne(
          { symbol },
          { $set: { symbol, name } },
          { upsert: true }
        );
        count++;
      }
    }
    res.status(200).json({ message: `Updated ${count} tickers.` });
  } catch (e) {
    res.status(500).json({ error: "Failed to update tickers" });
  }
}
