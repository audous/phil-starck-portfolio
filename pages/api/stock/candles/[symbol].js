export default async function handler(req, res) {
  const { symbol } = req.query;
  const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY; // Public API key
  if (!API_KEY) {
    return res.status(500).json({ error: "Missing Finnhub API key" });
  }
  const to = Math.floor(Date.now() / 1000);
  const from = to - 30 * 24 * 60 * 60; // last 30 days
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${API_KEY}`;

  try {
    const candleRes = await fetch(url);
    const candleData = await candleRes.json();
    res.status(200).json(candleData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candles." });
  }
}
