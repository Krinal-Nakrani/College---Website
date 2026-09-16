import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCourses } from "../api";
import "../styles/programs.css";

export default function Programs() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses()
      .then((data) => setCourses(data.slice(0, 6)))
      .catch(() => setCourses(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section programs">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="kicker">Programs</span>
            <h2>Choose a discipline, not just a degree</h2>
          </div>
          <p className="lede">
            Every program pairs classroom fundamentals with lab hours from the
            first semester.
          </p>
        </div>

        <div className="programs__list">
          {loading && <p>Loading programs…</p>}
          {!loading &&
            courses.map((c, i) => (
              <Link
                to={c.slug ? `/courses/${c.slug}` : "/courses"}
                className="programs__row"
                key={c.slug || i}
              >
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

        <Link to="/courses" className="btn btn-outline-dark programs__all">
          View All Programs
        </Link>
      </div>
    </section>
  );
}

const FALLBACK = [
  { name: "Computer Engineering", level: "Diploma", duration: "3 Years", department: "Computer" },
  { name: "Mechanical Engineering", level: "Diploma", duration: "3 Years", department: "Mechanical" },
  { name: "Electrical Engineering", level: "Diploma", duration: "3 Years", department: "Electrical" },
  { name: "Civil Engineering", level: "Diploma", duration: "3 Years", department: "Civil" },
];
