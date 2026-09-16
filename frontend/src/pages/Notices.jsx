import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { fetchNotices } from "../api";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices().then(setNotices).catch(() => setNotices([])).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Notice Board"
        title="Notices & circulars"
        lede="Pinned items stay at the top. This list is managed by office staff through the admin panel — no code changes needed."
      />
      <section className="section">
        <div className="container">
          {loading && <p>Loading notices…</p>}
          {!loading && notices.length === 0 && <p>No notices published yet.</p>}
          <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "1px solid var(--mist-light)" }}>
            {notices.map((n) => (
              <li
                key={n._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "18px 0",
                  borderBottom: "1px solid var(--mist-light)",
                }}
              >
                <span>
                  {n.pinned && <strong style={{ color: "var(--amber)", marginRight: 8 }}>PINNED</strong>}
                  {n.title}
                </span>
                <span style={{ display: "flex", gap: 10, color: "var(--mist)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                  <span>{n.category}</span>
                  <span style={{ borderLeft: "1px solid var(--mist-light)", paddingLeft: 10 }}>
                    {new Date(n.publishedAt).toLocaleDateString("en-IN")}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
