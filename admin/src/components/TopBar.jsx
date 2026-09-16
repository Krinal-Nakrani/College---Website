import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";

export default function TopBar({ title = "Dashboard" }) {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const initial = (user?.email?.charAt(0) || "A").toUpperCase();

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
          <div className="topbar-avatar">{initial}</div>
          <div className="topbar-user-meta">
            <span className="topbar-email">{user?.email || "Staff"}</span>
            <span className="topbar-role">Authorized Staff</span>
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
