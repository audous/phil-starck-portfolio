import { useState } from "react";
import dynamic from "next/dynamic";
import withLoginGate from "../../components/hoc/withLoginGate";
const StockTickers = dynamic(
  () => import("../../components/stocks/StockTickers"),
  { ssr: false }
);
import StockCandles from "../../components/stocks/StockCandles";
import StockNews from "../../components/stocks/StockNews";

function StocksPage() {
  const [selected, setSelected] = useState("");
  const [candle, setCandle] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (symbol) => {
    setSelected(symbol);
    setCandle(null);
    setNews([]);
    if (!symbol) return;

    setLoading(true);

    // Fetch candles
    const candleRes = await fetch(`/api/stock/candles/${symbol}`);
    const candleData = await candleRes.json();
    setCandle(candleData);

    // Fetch news
    const newsRes = await fetch(`/api/stock/news/${symbol}`);
    const newsData = await newsRes.json();
    setNews(newsData);

    setLoading(false);
  };

  return (
    <div>
      <h1>Stock Explorer</h1>
      <StockTickers onSelect={handleSelect} />
      {loading && <div>Loading...</div>}
      {!loading && selected && (
        <>
          <StockCandles candleData={candle} symbol={selected} />
          <StockNews newsData={news} symbol={selected} />
        </>
      )}
    </div>
  );
}
export default withLoginGate(StocksPage);
