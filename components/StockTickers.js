import { useState, useEffect } from "react";

export default function StockTickers({ onSelect }) {
  const [input, setInput] = useState("");
  const [tickers, setTickers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tickers");
      const data = await res.json();
      setTickers(data.tickers || []);
      setFiltered(data.tickers || []);
    }
    load();
  }, []);

  function handleChange(e) {
    const value = e.target.value.toUpperCase();
    setInput(value);
    setFiltered(
      tickers.filter(
        (t) =>
          t.symbol.startsWith(value) ||
          (t.name && t.name.toUpperCase().includes(value))
      )
    );
  }

  function handleSelect(symbol) {
    setInput(symbol);
    setFiltered(tickers.filter((t) => t.symbol === symbol));
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
        style={{ padding: 8, fontSize: 16, width: 240, marginRight: 8 }}
      />
      <datalist id="tickers">
        {filtered.slice(0, 100).map((ticker) => (
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
    </div>
  );
}
