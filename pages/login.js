// pages/login.js

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    login: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  // Handle login form
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: loginForm.email,
      password: loginForm.password,
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("Invalid login credentials");
    }
  };

  // Handle register form
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setRegisterMessage("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerForm),
    });

    const data = await res.json();
    if (res.ok) {
      setRegisterMessage("User created! You can now log in.");
      setRegisterForm({ login: "", email: "", password: "" });
    } else {
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Login Form */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            className="border p-2 w-full"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            className="border p-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 w-full"
          >
            Log In
          </button>
        </form>
      </div>

      {/* Register Form */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="login"
            placeholder="Username"
            value={registerForm.login}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, login: e.target.value })
            }
            className="border p-2 w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, email: e.target.value })
            }
            className="border p-2 w-full"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, password: e.target.value })
            }
            className="border p-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 w-full"
          >
            Register
          </button>
        </form>
        {registerMessage && (
          <p className="text-green-600 mt-2">{registerMessage}</p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="col-span-2 text-red-600 text-center mt-4">{error}</div>
      )}
    </div>
  );
}
