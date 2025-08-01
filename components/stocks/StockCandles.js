import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function StockCandles({ candleData, symbol }) {
  if (!candleData || candleData.s !== "ok") {
    return <div>No chart data available for {symbol}.</div>;
  }

  const chartData = {
    labels: candleData.t.map((ts) => new Date(ts * 1000).toLocaleDateString()),
    datasets: [
      {
        label: `${symbol} Close Price`,
        data: candleData.c,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div style={{ width: "100%", maxWidth: 600 }}>
      <Line data={chartData} />
    </div>
  );
}
