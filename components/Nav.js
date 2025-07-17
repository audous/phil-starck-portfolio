import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Nav() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <div>
        <Link href="/" className="mr-4">
          Home
        </Link>
        <Link href="/about" className="mr-4">
          About
        </Link>
      </div>
      <div>
        {session ? (
          <>
            <span className="mr-4">Hi, {session.user.name}</span>
            <button onClick={() => signOut()} className="underline">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
