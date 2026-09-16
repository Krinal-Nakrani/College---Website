import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login attempt failed:", err);
      let msg = "Failed to sign in. Please check your credentials.";
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        msg = "Incorrect email address or password.";
      } else if (
        err.code === "auth/api-key-not-valid" ||
        err.message?.includes("api-key-not-valid")
      ) {
        msg = "Firebase API Key is a placeholder. Please paste your actual Firebase Web App config in admin/.env and restart Vite.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Please wait a few minutes before trying again.";
      } else if (err.code === "auth/network-request-failed") {
        msg = "Network connection failed. Check your internet connection.";
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-grid-bg" />

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo" aria-label="Nilkanth Logo">
            <span className="login-logo-icon">N</span>
          </div>
          <h1 className="login-title">Staff Portal</h1>
          <p className="login-subtitle">Nilkanth Polytechnic &amp; Degree Institute</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error" role="alert">
              <span className="login-error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="login-field">
            <label htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@nilkanth.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="login-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={submitting}>
            {submitting ? (
              <span className="login-btn-loading">
                <span className="login-spinner" />
                <span>Signing In…</span>
              </span>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        <p className="login-footer-text">
          Authorized Staff &amp; Faculty Access Only
        </p>
      </div>
    </div>
  );
}
