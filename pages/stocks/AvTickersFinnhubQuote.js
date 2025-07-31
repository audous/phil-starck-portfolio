import { useState } from "react";
import StockTickers from "../../components/StockTickers";
import withLoginGate from "../../components/hoc/withLoginGate";

function AvTickersFinnhubQuote() {
  const [selected, setSelected] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchQuote(symbol) {
    setSelected(symbol);
    setLoading(true);
    setError("");
    setData(null);

    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!apiKey) {
      setError("Missing Finnhub API key");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
      );
      const d = await res.json();
      if (!d || d.c == null) {
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
      <h2>
        Alpha Vantage Tickers
        <br />
        Finnhub Real-Time Quote
      </h2>
      <StockTickers onSelect={fetchQuote} />
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
export default withLoginGate(AvTickersFinnhubQuote);
