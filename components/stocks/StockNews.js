export default function StockNews({ newsData, symbol }) {
  if (!newsData || !Array.isArray(newsData) || newsData.length === 0) {
    return <div>No news found for {symbol}.</div>;
  }

  // Filter out items with invalid or missing datetime, sort by most recent
  const validNews = newsData
    .filter(
      (item) => typeof item.datetime === "number" && item.datetime > 1000000000
    )
    .sort((a, b) => b.datetime - a.datetime)
    .slice(0, 5);

  if (validNews.length === 0) {
    return <div>No recent news found for {symbol}.</div>;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Latest News for {symbol}</h3>
      <ul>
        {validNews.map((item) => (
          <li key={item.id || item.url} style={{ marginBottom: 16 }}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 600 }}
            >
              {item.headline || item.title}
            </a>
            <div style={{ fontSize: "0.9em", color: "#666" }}>
              {item.source} &middot;{" "}
              {item.datetime && new Date(item.datetime * 1000).toLocaleString()}
            </div>
            <div>{item.summary}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
