import { NavLink } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const navItems = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/notices", label: "Notices & Circulars", icon: "📢" },
  { path: "/courses", label: "Academic Programs", icon: "🎓" },
  { path: "/messages", label: "Student Enquiries", icon: "✉️" },
];

export default function Sidebar() {
  const { sidebarOpen, closeSidebar } = useSidebar();
  const publicUrl = import.meta.env.VITE_CLIENT_ORIGIN || "http://localhost:5173";

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar${sidebarOpen ? " sidebar--open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-inner">
            <div className="sidebar-mark" aria-label="Nilkanth Logo">
              <span>N</span>
            </div>
            <div className="sidebar-brand-text">
              <h2 className="sidebar-title">Nilkanth</h2>
              <span className="sidebar-subtitle">STAFF CONSOLE</span>
            </div>
          </div>

          <button
            className="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-section-label">MANAGEMENT</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " sidebar-link--active" : ""}`
              }
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
            </NavLink>
          ))}

          <div className="sidebar-divider" />

          <div className="sidebar-nav-section-label">EXTERNAL</div>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-link sidebar-link--external"
            title="Open Public College Website"
          >
            <span className="sidebar-link-icon">↗</span>
            <span className="sidebar-link-label">Public Website</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-badge">
            <span className="status-indicator-dot" />
            <span>Staff Portal v1.0</span>
          </div>
          <div className="sidebar-copy">Engineering Drawing System</div>
        </div>
      </aside>
    </>
  );
}
