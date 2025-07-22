import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import LoginModal from "../components/LoginModal";

export default function Dashboard() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to Phil Starcks Portfolio
      </h1>

      {session ? (
        <div className="flex flex-col items-start gap-2">
          <p>Hello, {session.user.name || session.user.email}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
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
