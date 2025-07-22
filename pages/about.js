import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import LoginModal from "../components/LoginModal";

export default function About() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">About Phil Starck</h1>

      {session ? (
        <div>
          <p>Welcome, {session.user.name || session.user.email}</p>
          <button
            onClick={() => signOut()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login / Register
        </button>
      )}

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
