import { useState, useEffect, useRef } from "react";

export default function StockTickers({ onSelect }) {
  const [input, setInput] = useState("");
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  function handleChange(e) {
    const value = e.target.value.toUpperCase();
    setInput(value);

    // Only fetch if input is at least 1 char
    if (value.length === 0) {
      setTickers([]);
      return;
    }

    setLoading(true);

    // Debounce the API call by 300ms
    if (timeoutId) clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(async () => {
      const res = await fetch(
        `/api/tickers?search=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setTickers(data.tickers || []);
      setLoading(false);
    }, 300);
    setTimeoutId(newTimeoutId);
  }

  function handleSelect(symbol) {
    setInput(symbol);
    setTickers([]);
    onSelect(symbol);
  }

  return (
    <div>
      <input
        type="text"
        list="tickers"
        value={input}
        placeholder="Type a stock symbol..."
        onChange={handleChange}
        style={{ padding: 8, fontSize: 16, width: 260, marginRight: 8 }}
      />
      <datalist id="tickers">
        {tickers.map((ticker) => (
          <option
            value={ticker.symbol}
            label={
              ticker.name ? `${ticker.symbol} - ${ticker.name}` : ticker.symbol
            }
            key={ticker.symbol}
          />
        ))}
      </datalist>
      <button
        onClick={() => handleSelect(input)}
        disabled={!tickers.some((t) => t.symbol === input)}
      >
        Load
      </button>
      {loading && <span style={{ marginLeft: 10 }}>Loading...</span>}
    </div>
  );
}
