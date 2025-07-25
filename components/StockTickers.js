// components/StockTickers.js
import { useState } from "react";

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

export default function StockTickers({ onSelect }) {
  const [input, setInput] = useState("");
  const [filtered, setFiltered] = useState(TICKERS);

  function handleChange(e) {
    const value = e.target.value.toUpperCase();
    setInput(value);
    setFiltered(TICKERS.filter((t) => t.startsWith(value)));
  }

  function handleSelect(ticker) {
    setInput(ticker);
    setFiltered([ticker]);
    onSelect(ticker);
  }

  return (
    <div>
      <input
        type="text"
        list="tickers"
        value={input}
        placeholder="Type a stock symbol..."
        onChange={handleChange}
        style={{ padding: 8, fontSize: 16, width: 220, marginRight: 8 }}
      />
      <datalist id="tickers">
        {filtered.map((ticker) => (
          <option value={ticker} key={ticker} />
        ))}
      </datalist>
      <button
        onClick={() => handleSelect(input)}
        disabled={!TICKERS.includes(input)}
      >
        Load
      </button>
    </div>
  );
}
