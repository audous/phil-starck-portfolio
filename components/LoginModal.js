import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const [registerLogin, setRegisterLogin] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      setLoginError("Invalid email or password");
    } else {
      onClose(); // close modal on success
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        login: registerLogin,
        email: registerEmail,
        password: registerPassword,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      alert("Registration successful. You can now log in.");
      setIsRegistering(false);
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          {isRegistering ? "Register" : "Login"}
        </h2>

        {isRegistering ? (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              className="w-full mb-3 border p-2 rounded"
              placeholder="Login Name"
              value={registerLogin}
              onChange={(e) => setRegisterLogin(e.target.value)}
              required
            />
            <input
              type="email"
              className="w-full mb-3 border p-2 rounded"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full mb-3 border p-2 rounded"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
            <button className="w-full bg-green-600 text-white py-2 rounded">
              Register
            </button>
            <p className="text-sm mt-2">
              Already have an account?{" "}
              <button
                type="button"
                className="underline text-blue-600"
                onClick={() => setIsRegistering(false)}
              >
                Log in
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="w-full mb-3 border p-2 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full mb-3 border p-2 rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded">
              Login
            </button>
            {loginError && (
              <p className="text-red-500 text-sm mt-2">{loginError}</p>
            )}
            <p className="text-sm mt-2">
              Don’t have an account?{" "}
              <button
                type="button"
                className="underline text-green-600"
                onClick={() => setIsRegistering(true)}
              >
                Register
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
