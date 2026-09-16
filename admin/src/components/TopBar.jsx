import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";

export default function TopBar({ title = "Dashboard" }) {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-hamburger"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        <div className="topbar-user" title={`Signed in as ${user?.email || "Staff"}`}>
          <div className="topbar-avatar" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="topbar-user-meta">
            <span className="topbar-email">{user?.email || "Staff"}</span>
            <span className="topbar-role">Staff Account</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="topbar-logout"
          title="Sign out of Admin Portal"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
