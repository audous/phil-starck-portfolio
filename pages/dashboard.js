import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import LoginModal from "../components/LoginModal";
import Nav from "../components/Nav";

export default function Dashboard() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      <Nav />
      <h1 className="text-2xl font-bold mb-4">
        Welcome to Phil Starck&apos;s Portfolio
      </h1>

      {session ? (
        <div className="flex flex-col items-start gap-2">
          <p>Hello, {session.user.name || session.user.email}</p>
          <button onClick={() => signOut()} className="button-nintendo">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={() => setShowModal(true)} className="button-nintendo">
          Login / Register
        </button>
      )}

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
