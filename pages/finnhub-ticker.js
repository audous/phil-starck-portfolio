import { useState } from "react";

// Simple ticker list; expand as needed
const TICKERS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "TSLA",
  "META",
  "NVDA",
  "NFLX",
  "AMD",
  "INTC",
];

export default function FinnhubTickerPage() {
  const [selected, setSelected] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchQuote(symbol) {
    setLoading(true);
    setError("");
    setData(null);
    setSelected(symbol);

    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!apiKey) {
      setError("Missing API key");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
      );
      const d = await res.json();
      if (!d || !d.c) {
        setError("No data found for this symbol.");
        setLoading(false);
        return;
      }
      setData(d);
    } catch {
      setError("Failed to fetch data.");
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>Real-Time Stock Quote (Finnhub.io)</h2>
      <label>
        <span>Pick a ticker:</span>
        <select
          style={{ marginLeft: 12, padding: 6, fontSize: 16 }}
          value={selected}
          onChange={(e) => fetchQuote(e.target.value)}
        >
          <option value="">-- Select a ticker --</option>
          {TICKERS.map((ticker) => (
            <option value={ticker} key={ticker}>
              {ticker}
            </option>
          ))}
        </select>
      </label>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <div style={{ marginTop: 20 }}>
          <h3>{selected} Latest Quote</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <b>Current Price:</b> ${data.c}
            </li>
            <li>
              <b>High:</b> ${data.h}
            </li>
            <li>
              <b>Low:</b> ${data.l}
            </li>
            <li>
              <b>Open:</b> ${data.o}
            </li>
            <li>
              <b>Previous Close:</b> ${data.pc}
            </li>
            <li>
              <b>Timestamp:</b>{" "}
              {data.t ? new Date(data.t * 1000).toLocaleString() : "-"}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
