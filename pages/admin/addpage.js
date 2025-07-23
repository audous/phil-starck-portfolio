// pages/admin/addpage.js
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Nav from "../../components/Nav";

export default function AddPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Only allow admin
  if (!session || session.user.meta !== "admin") {
    if (typeof window !== "undefined") router.replace("/dashboard");
    return <div>Redirecting...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const res = await fetch("/api/admin/addpage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, html }),
    });
    if (res.ok) {
      setSuccess("Page added!");
      setTitle("");
      setHtml("");
    } else {
      const data = await res.json();
      setError(data.error || "Error adding page");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <Nav />
      <h1 className="text-2xl font-bold mb-4">Add New Page</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Page Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2"
          required
        />
        <textarea
          placeholder="HTML Content"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows={10}
          className="border rounded p-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Page
        </button>
        {success && <div className="text-green-600">{success}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
}
