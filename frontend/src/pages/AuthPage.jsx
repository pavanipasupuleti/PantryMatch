import { useState } from "react";
import { GiCookingPot } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function AuthPage() {
  const { login, register, continueAsGuest } = useAuth();
  const [mode, setMode] = useState("landing"); // "landing" | "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next) => {
    setError("");
    setForm({ name: "", email: "", password: "" });
    setMode(next);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <GiCookingPot className="auth-logo-icon" />
          <span className="auth-logo-text">
            Pantry<span>Match</span>
          </span>
        </div>
        <p className="auth-tagline">Cook what you already have</p>

        {/* Landing */}
        {mode === "landing" && (
          <div className="auth-landing-btns">
            <button className="auth-btn-primary" onClick={() => switchMode("login")}>
              Log In
            </button>
            <button className="auth-btn-secondary" onClick={() => switchMode("register")}>
              Create Account
            </button>
            <div className="auth-divider">or</div>
            <button className="auth-btn-guest" onClick={continueAsGuest}>
              Continue as Guest →
            </button>
          </div>
        )}

        {/* Login */}
        {mode === "login" && (
          <>
            <button className="auth-back" onClick={() => switchMode("landing")}>
              ← Back
            </button>
            <h2 className="auth-title">Welcome back</h2>
            {error && <p className="auth-error">{error}</p>}
            <form className="auth-form" onSubmit={handleLogin}>
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button className="auth-btn-primary" type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
            <p className="auth-switch">
              Don't have an account?
              <button onClick={() => switchMode("register")}>Create one</button>
            </p>
          </>
        )}

        {/* Register */}
        {mode === "register" && (
          <>
            <button className="auth-back" onClick={() => switchMode("landing")}>
              ← Back
            </button>
            <h2 className="auth-title">Create your account</h2>
            {error && <p className="auth-error">{error}</p>}
            <form className="auth-form" onSubmit={handleRegister}>
              <input
                className="auth-input"
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Password (min 6 chars)"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button className="auth-btn-primary" type="submit" disabled={loading}>
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
            <p className="auth-switch">
              Already have an account?
              <button onClick={() => switchMode("login")}>Sign in</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
