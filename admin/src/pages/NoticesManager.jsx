import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import {
  fetchNotices,
  createNotice,
  updateNotice,
  patchNotice,
  deleteNotice,
} from "../api";
import "../styles/managers.css";

const CATEGORIES = ["Admission", "Exam", "Event", "General"];

const emptyForm = {
  title: "",
  category: "General",
  fileUrl: "",
  pinned: false,
};

export default function NoticesManager() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ ...emptyForm });

  async function load() {
    try {
      const data = await fetchNotices();
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load notices:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function openEdit(notice) {
    setForm({
      title: notice.title,
      category: notice.category || "General",
      fileUrl: notice.fileUrl || "",
      pinned: !!notice.pinned,
    });
    setEditingId(notice._id);
    setShowForm(true);
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateNotice(editingId, form);
      } else {
        await createNotice(form);
      }
      resetForm();
      await load();
    } catch (err) {
      alert(`Failed to save notice: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function togglePin(notice) {
    try {
      const newPinned = !notice.pinned;
      await patchNotice(notice._id, { pinned: newPinned });
      setNotices((prev) =>
        prev.map((n) => (n._id === notice._id ? { ...n, pinned: newPinned } : n))
      );
    } catch (err) {
      alert("Failed to toggle pinned status: " + err.message);
    }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Are you sure you want to delete notice:\n"${title}"?`)) return;
    try {
      await deleteNotice(id);
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert("Failed to delete notice: " + err.message);
    }
  }

  const filtered =
    filter === "all"
      ? notices
      : notices.filter((n) => (n.category || "general").toLowerCase() === filter.toLowerCase());

  return (
    <>
      <TopBar title="Notices &amp; Circulars" />

      <div className="manager-content">
        <div className="manager-toolbar">
          <div className="manager-toolbar-group">
            <h3 className="manager-count">
              {filtered.length} announcement{filtered.length !== 1 ? "s" : ""}
            </h3>

            <div className="manager-filters">
              <button
                className={`filter-btn${filter === "all" ? " filter-btn--active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn${filter === cat ? " filter-btn--active" : ""}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            className="manager-add-btn"
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            id="add-notice-btn"
          >
            {showForm ? "✕ Cancel" : "+ New Notice"}
          </button>
        </div>

        {showForm && (
          <form className="manager-form" onSubmit={handleSubmit} id="notice-form">
            <div className="form-row">
              <div className="form-field form-field--wide">
                <label htmlFor="notice-title">Notice Title *</label>
                <input
                  id="notice-title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Winter Semester Examination Timetable Published"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="notice-category">Category *</label>
                <select
                  id="notice-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field form-field--wide">
                <label htmlFor="notice-file">Attachment / Document URL (Optional)</label>
                <input
                  id="notice-file"
                  name="fileUrl"
                  type="url"
                  value={form.fileUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/notices/circular.pdf"
                />
              </div>

              <div className="form-field form-field--checkbox">
                <label htmlFor="notice-pinned">
                  <input
                    id="notice-pinned"
                    name="pinned"
                    type="checkbox"
                    checked={form.pinned}
                    onChange={handleChange}
                  />
                  <span>Pin this notice to top of public site 📌</span>
                </label>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button type="submit" className="form-submit" disabled={submitting}>
                {submitting
                  ? editingId
                    ? "Updating…"
                    : "Publishing…"
                  : editingId
                  ? "Update Notice"
                  : "Publish Notice"}
              </button>
              <button
                type="button"
                className="action-btn"
                onClick={resetForm}
                style={{ padding: "10px 18px", color: "var(--admin-ink-muted)" }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="manager-loading">
            <div className="loading-spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="manager-empty">
            <span className="manager-empty-icon">📢</span>
            <p>
              No notices found{filter !== "all" ? ` under category "${filter}"` : ""}. Click
              "+ New Notice" to create one.
            </p>
          </div>
        ) : (
          <div className="manager-table-wrap">
            <table className="manager-table" id="notices-table">
              <thead>
                <tr>
                  <th>Notice Title</th>
                  <th>Category</th>
                  <th>Pinned</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((n) => (
                  <tr key={n._id}>
                    <td className="td-title">
                      {n.pinned && <span style={{ marginRight: "6px" }}>📌</span>}
                      {n.title}
                      {n.fileUrl && (
                        <a
                          href={n.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="td-link"
                          title="Open attached document"
                        >
                          📎
                        </a>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge badge--${(n.category || "general").toLowerCase()}`}
                      >
                        {n.category || "General"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn"
                        style={{
                          background: n.pinned
                            ? "var(--admin-amber-glow)"
                            : "var(--admin-surface-raised)",
                          color: n.pinned ? "var(--admin-amber)" : "var(--admin-ink-muted)",
                        }}
                        onClick={() => togglePin(n)}
                        title={n.pinned ? "Click to unpin" : "Click to pin to top"}
                      >
                        {n.pinned ? "Pinned ★" : "Normal"}
                      </button>
                    </td>
                    <td className="td-date">
                      {new Date(n.publishedAt || n.createdAt).toLocaleDateString()}
                    </td>
                    <td className="td-actions">
                      <button
                        className="action-btn action-btn--edit"
                        onClick={() => openEdit(n)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn action-btn--delete"
                        onClick={() => handleDelete(n._id, n.title)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
