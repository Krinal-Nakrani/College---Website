import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "var(--paper, #f6f4ef)",
          color: "var(--ink, #10243b)",
          gap: "16px",
          fontFamily: "var(--font-display, sans-serif)",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid #dce1e4",
            borderTopColor: "#e3a23c",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ fontSize: "0.95rem", fontWeight: 500, letterSpacing: "0.02em" }}>
          Verifying staff credentials…
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
