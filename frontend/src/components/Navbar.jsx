import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";

const NAV = [
  { label: "About", to: "/about" },
  {
    label: "Programs",
    children: [
      { label: "Diploma — Computer Engineering", to: "/courses/diploma-computer-engineering" },
      { label: "Diploma — Mechanical Engineering", to: "/courses/diploma-mechanical-engineering" },
      { label: "Diploma — Electrical Engineering", to: "/courses/diploma-electrical-engineering" },
      { label: "Diploma — Civil Engineering", to: "/courses/diploma-civil-engineering" },
      { label: "All Programs", to: "/courses" },
    ],
  },
  { label: "Admissions", to: "/admissions" },
  { label: "Notices", to: "/notices" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__mark">NP</span>
          <span className="navbar__name">
            Nilkanth Polytechnic
            <small>&amp; Institute of Engineering</small>
          </span>
        </Link>

        <nav className={`navbar__nav ${mobileOpen ? "is-open" : ""}`}>
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="navbar__item has-children"
                onMouseEnter={() => setOpen(item.label)}
                onMouseLeave={() => setOpen(false)}
              >
                <button className="navbar__link" aria-expanded={open === item.label}>
                  {item.label}
                </button>
                {open === item.label && (
                  <div className="navbar__dropdown">
                    {item.children.map((c) => (
                      <Link key={c.to} to={c.to} className="navbar__dropdown-link">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => "navbar__link" + (isActive ? " is-active" : "")}
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="navbar__actions">
          <Link to="/admissions" className="btn btn-primary navbar__cta">Apply Now</Link>
          <button
            className="navbar__burger"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
