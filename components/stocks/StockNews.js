export default function StockNews({ newsData, symbol }) {
  if (!newsData || !Array.isArray(newsData) || newsData.length === 0) {
    return <div>No news found for {symbol}.</div>;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Latest News for {symbol}</h3>
      <ul>
        {newsData.slice(0, 5).map((item) => (
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
              {item.datetime && new Date(item.datetime).toLocaleString()}
            </div>
            <div>{item.summary}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
