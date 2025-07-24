import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginModal({ onClose = () => {} }) {
  // Login/register state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const [registerLogin, setRegisterLogin] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginError, setLoginError] = useState("");

  // Forgot password state
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
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

  // Registration handler
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
      // ✅ Auto login after successful registration
      const loginResult = await signIn("credentials", {
        redirect: false,
        email: registerEmail,
        password: registerPassword,
      });

      if (loginResult.ok) {
        onClose(); // Close the modal on successful login
      } else {
        alert("Registration succeeded, but auto-login failed.");
      }
    } else {
      alert(data.message || "Registration failed");
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    setForgotError("");
    setIsSendingReset(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMessage(
          "If your email is in our system, you’ll get a reset link shortly."
        );
      } else {
        setForgotError(data.message || "Failed to send reset email.");
      }
    } catch (err) {
      setForgotError("An error occurred. Please try again.");
    }
    setIsSendingReset(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
        <button
          onClick={onClose}
          className="button-nintendo absolute top-3 right-3"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          {isRegistering
            ? "Register"
            : forgotPassword
            ? "Reset Password"
            : "Login"}
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
            <button className="button-nintendo">Register</button>
            <p className="text-sm mt-2">
              Already have an account?{" "}
              <button
                type="button"
                className="button-nintendo"
                onClick={() => setIsRegistering(false)}
              >
                Log in
              </button>
            </p>
          </form>
        ) : forgotPassword ? (
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              className="w-full mb-3 border p-2 rounded"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <button
              className="button-nintendo"
              type="submit"
              disabled={isSendingReset}
            >
              {isSendingReset ? "Sending..." : "Send Reset Link"}
            </button>
            {forgotMessage && (
              <p className="text-green-600 text-sm mt-2">{forgotMessage}</p>
            )}
            {forgotError && (
              <p className="text-red-500 text-sm mt-2">{forgotError}</p>
            )}
            <p className="text-sm mt-2">
              Remembered your password?{" "}
              <button
                type="button"
                className="button-nintendo"
                onClick={() => {
                  setForgotPassword(false);
                  setForgotEmail("");
                  setForgotError("");
                  setForgotMessage("");
                }}
              >
                Back to Login
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
            <button className="button-nintendo">Login</button>
            {loginError && (
              <p className="text-red-500 text-sm mt-2">{loginError}</p>
            )}
            <p className="text-sm mt-2">
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={() => {
                  setForgotPassword(true);
                  setForgotEmail("");
                  setForgotError("");
                  setForgotMessage("");
                }}
              >
                Forgot password?
              </button>
            </p>
            <p className="text-sm mt-2">
              Don’t have an account?{" "}
              <button
                type="button"
                className="button-nintendo"
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
