import { useState } from "react";

export default function UpdateTickersAdmin() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    setStatus("");
    const res = await fetch("/api/update-tickers", { method: "POST" });
    const data = await res.json();
    if (res.ok) setStatus(data.message);
    else setStatus(data.error || "Error updating tickers");
    setLoading(false);
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Admin: Update Stock Tickers</h1>
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Tickers"}
      </button>
      <p>{status}</p>
    </div>
  );
}
