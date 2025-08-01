export default async function handler(req, res) {
  const { symbol } = req.query;
  const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY; // Public API key
  if (!API_KEY) {
    return res.status(500).json({ error: "Missing Finnhub API key" });
  }
  const today = new Date();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${weekAgo
    .toISOString()
    .slice(0, 10)}&to=${today.toISOString().slice(0, 10)}&token=${API_KEY}`;

  try {
    const newsRes = await fetch(url);
    const newsData = await newsRes.json();
    res.status(200).json(newsData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news." });
  }
}
