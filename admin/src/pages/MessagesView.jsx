import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { fetchMessages, updateMessage, deleteMessage } from "../api";
import "../styles/managers.css";

const STATUS_OPTIONS = ["new", "contacted", "closed"];

export default function MessagesView() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  async function load() {
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleStatusChange(id, status) {
    try {
      const updated = await updateMessage(id, { status });
      setMessages((prev) => prev.map((m) => (m._id === id ? updated : m)));
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete enquiry from "${name}"?`)) return;
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  }

  const filtered =
    filter === "all" ? messages : messages.filter((m) => m.status === filter);

  return (
    <>
      <TopBar title="Enquiries" />
      <div className="manager-content">
        <div className="manager-toolbar">
          <h3 className="manager-count">
            {filtered.length} message{filtered.length !== 1 ? "s" : ""}
            {filter !== "all" && (
              <span className="filter-label"> ({filter})</span>
            )}
          </h3>

          <div className="manager-filters" id="message-filters">
            {["all", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                className={`filter-btn${filter === s ? " filter-btn--active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="manager-loading">
            <div className="loading-spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="manager-empty">
            <span className="manager-empty-icon">✉️</span>
            <p>No enquiries{filter !== "all" ? ` with status "${filter}"` : ""} yet.</p>
          </div>
        ) : (
          <div className="messages-list" id="messages-list">
            {filtered.map((m) => (
              <div
                key={m._id}
                className={`message-card${expanded === m._id ? " message-card--expanded" : ""}${
                  m.status === "new" ? " message-card--new" : ""
                }`}
                onClick={() => setExpanded(expanded === m._id ? null : m._id)}
              >
                <div className="message-card-header">
                  <div className="message-card-left">
                    <span className={`status-dot status-dot--${m.status}`} />
                    <div>
                      <span className="message-name">{m.name}</span>
                      <span className="message-meta">
                        {m.email} · {m.phone}
                      </span>
                    </div>
                  </div>
                  <div className="message-card-right">
                    {m.course && (
                      <span className="badge badge--general">{m.course}</span>
                    )}
                    <span className="message-date">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {expanded === m._id && (
                  <div className="message-card-body" onClick={(e) => e.stopPropagation()}>
                    {m.message ? (
                      <p className="message-text">{m.message}</p>
                    ) : (
                      <p className="message-text message-text--empty">No message provided</p>
                    )}

                    <div className="message-actions">
                      <div className="message-status-group">
                        <label>Status:</label>
                        <select
                          value={m.status}
                          onChange={(e) => handleStatusChange(m._id, e.target.value)}
                          className="status-select"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        className="action-btn action-btn--delete"
                        onClick={() => handleDelete(m._id, m.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
