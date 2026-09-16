import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { fetchCourses, createCourse, updateCourse, deleteCourse } from "../api";
import "../styles/managers.css";

const LEVELS = ["Diploma", "Degree"];

const emptyForm = {
  name: "",
  level: "Diploma",
  department: "",
  duration: "3 Years",
  intake: "",
  summary: "",
  slug: "",
  order: 0,
};

export default function CoursesManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // course _id or null
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  async function load() {
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function autoSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function handleNameChange(e) {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: editing ? prev.slug : autoSlug(name),
    }));
  }

  function openEdit(course) {
    setForm({
      name: course.name,
      level: course.level,
      department: course.department,
      duration: course.duration,
      intake: course.intake,
      summary: course.summary,
      slug: course.slug,
      order: course.order || 0,
    });
    setEditing(course._id);
    setShowForm(true);
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditing(null);
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, intake: Number(form.intake), order: Number(form.order) };
      if (editing) {
        await updateCourse(editing, payload);
      } else {
        await createCourse(payload);
      }
      resetForm();
      await load();
    } catch (err) {
      alert(`Failed to ${editing ? "update" : "create"} course: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete course "${name}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  }

  return (
    <>
      <TopBar title="Courses" />
      <div className="manager-content">
        <div className="manager-toolbar">
          <h3 className="manager-count">
            {courses.length} course{courses.length !== 1 ? "s" : ""}
          </h3>
          <button
            className="manager-add-btn"
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            id="add-course-btn"
          >
            {showForm ? "✕ Cancel" : "+ New Course"}
          </button>
        </div>

        {showForm && (
          <form className="manager-form" onSubmit={handleSubmit} id="course-form">
            <div className="form-row">
              <div className="form-field form-field--wide">
                <label htmlFor="course-name">Course Name *</label>
                <input
                  id="course-name"
                  name="name"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Computer Engineering"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="course-level">Level *</label>
                <select id="course-level" name="level" value={form.level} onChange={handleChange}>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="course-dept">Department *</label>
                <input
                  id="course-dept"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="course-duration">Duration *</label>
                <input
                  id="course-duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 3 Years"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="course-intake">Intake *</label>
                <input
                  id="course-intake"
                  name="intake"
                  type="number"
                  value={form.intake}
                  onChange={handleChange}
                  placeholder="60"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field form-field--wide">
                <label htmlFor="course-slug">URL Slug *</label>
                <input
                  id="course-slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="computer-engineering"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="course-order">Sort Order</label>
                <input
                  id="course-order"
                  name="order"
                  type="number"
                  value={form.order}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field form-field--full">
                <label htmlFor="course-summary">Summary *</label>
                <textarea
                  id="course-summary"
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  placeholder="Brief description of the course"
                  rows="3"
                  required
                />
              </div>
            </div>

            <button type="submit" className="form-submit" disabled={submitting}>
              {submitting
                ? editing ? "Updating…" : "Creating…"
                : editing ? "Update Course" : "Create Course"
              }
            </button>
          </form>
        )}

        {loading ? (
          <div className="manager-loading">
            <div className="loading-spinner" />
          </div>
        ) : courses.length === 0 ? (
          <div className="manager-empty">
            <span className="manager-empty-icon">🎓</span>
            <p>No courses yet. Click "New Course" to add one.</p>
          </div>
        ) : (
          <div className="manager-table-wrap">
            <table className="manager-table" id="courses-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Level</th>
                  <th>Department</th>
                  <th>Duration</th>
                  <th>Intake</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id}>
                    <td className="td-title">{c.name}</td>
                    <td>
                      <span className={`badge badge--${c.level.toLowerCase()}`}>{c.level}</span>
                    </td>
                    <td>{c.department}</td>
                    <td>{c.duration}</td>
                    <td>{c.intake}</td>
                    <td className="td-actions">
                      <button
                        className="action-btn action-btn--edit"
                        onClick={() => openEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn action-btn--delete"
                        onClick={() => handleDelete(c._id, c.name)}
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
