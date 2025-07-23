// components/Nav.js
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Nav() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex gap-4 p-4 bg-gray-100 rounded-2xl shadow items-center">
      <Link href="/dashboard" className="font-bold hover:underline">
        Dashboard
      </Link>
      &nbsp;
      {session?.user?.meta === "admin" && (
        <Link href="/admin/addpage" className="font-bold hover:underline">
          Add Page
        </Link>
      )}
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
