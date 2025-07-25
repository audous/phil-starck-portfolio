// pages/stock-tickers.js
import { useState } from "react";
import dynamic from "next/dynamic";
import StockTickers from "../components/StockTickers";

// Chart.js imports & registration
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

// Correct dynamic import for Line
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

export default function StockTickersPage() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  async function fetchStockData(selectedTicker) {
    setLoading(true);
    setError("");
    setChartData(null);
    setTicker(selectedTicker);

    const apiKey =
      process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY ||
      process.env.ALPHAVANTAGE_API_KEY;
    if (!apiKey) {
      setError("API Key missing");
      setLoading(false);
      return;
    }
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${selectedTicker}&interval=5min&apikey=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data["Error Message"] || !data["Time Series (5min)"]) {
        setError("No data found or API limit reached.");
        setLoading(false);
        return;
      }
      const times = Object.keys(data["Time Series (5min)"]).reverse();
      const prices = times.map((time) =>
        Number(data["Time Series (5min)"][time]["4. close"])
      );
      setChartData({
        labels: times,
        datasets: [
          {
            label: `${selectedTicker} Close Price`,
            data: prices,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.2,
          },
        ],
      });
    } catch (err) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 16 }}>
      <h2>Stock Tickers</h2>
      <StockTickers onSelect={fetchStockData} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {chartData && (
        <div style={{ marginTop: 24 }}>
          <Line
            data={chartData}
            options={{
              scales: {
                x: { display: false },
                y: { beginAtZero: false },
              },
            }}
            height={350}
          />
        </div>
      )}
    </div>
  );
}
