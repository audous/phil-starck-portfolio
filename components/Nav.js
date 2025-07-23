import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    // Fetch all custom pages
    fetch("/api/admin/addpage")
      .then((res) => res.json())
      .then((data) => setPages(data));
  }, []);

  return (
    <nav className="flex gap-4 p-4 bg-gray-100 rounded-2xl shadow items-center">
      <Link href="/dashboard" className="font-bold hover:underline">
        Dashboard&nbsp;
      </Link>
      {session?.user?.meta === "admin" && (
        <Link href="/admin/addpage" className="font-bold hover:underline">
          Add Page&nbsp;
        </Link>
      )}
      {/* List custom pages */}
      {pages.map((page) => (
        <Link
          key={page._id}
          href={`/pages/${encodeURIComponent(page.title)}`}
          className="hover:underline"
        >
          {page.title}&nbsp;
        </Link>
      ))}
      {session && (
        <button
          onClick={() => signOut()}
          className="ml-auto px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Sign Out
        </button>
      )}
    </nav>
  );
}
