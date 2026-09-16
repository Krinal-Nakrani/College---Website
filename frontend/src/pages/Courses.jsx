import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { fetchCourses } from "../api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCourses(level || undefined)
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [level]);

  return (
    <>
      <PageHeader
        eyebrow="Programs"
        title="Diploma & degree engineering programs"
        lede="Every program is affiliated with MSBTE (diploma) or approved by AICTE (degree), with lab hours built into the weekly schedule."
      />
      <section className="section">
        <div className="container">
          <div className="programs__filter" style={{ display: "flex", gap: 10, marginBottom: 30 }}>
            {["", "Diploma", "Degree"].map((l) => (
              <button
                key={l || "all"}
                onClick={() => setLevel(l)}
                className={l === level ? "btn btn-outline-dark" : "btn btn-secondary"}
                style={l === level ? {} : { color: "var(--ink)", borderColor: "var(--mist-light)" }}
              >
                {l || "All"}
              </button>
            ))}
          </div>

          <div className="programs__list">
            {loading && <p>Loading programs…</p>}
            {!loading && courses.length === 0 && <p>No programs found for this filter.</p>}
            {!loading &&
              courses.map((c, i) => (
                <Link to={`/courses/${c.slug}`} className="programs__row" key={c.slug}>
                  <span className="programs__index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="programs__name">
                    {c.name}
                    <span className="programs__level">{c.level}</span>
                  </span>
                  <span className="programs__meta">{c.duration}</span>
                  <span className="programs__meta">{c.department}</span>
                  <span className="programs__arrow">View</span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
