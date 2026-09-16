import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { fetchCourse } from "../api";

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    fetchCourse(slug).then(setCourse).catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <section className="section container">
        <p>Program not found.</p>
        <Link to="/courses" className="btn btn-outline-dark">Back to Programs</Link>
      </section>
    );
  }

  if (!course) return <section className="section container"><p>Loading…</p></section>;

  return (
    <>
      <PageHeader eyebrow={course.level} title={course.name} lede={course.summary} />
      <section className="section">
        <div className="container">
          <dl style={{ display: "grid", gridTemplateColumns: "160px 1fr", rowGap: 14, maxWidth: 520, borderTop: "1px solid var(--mist-light)", paddingTop: 24 }}>
            <dt style={{ color: "var(--mist)" }}>Department</dt>
            <dd style={{ margin: 0 }}>{course.department}</dd>
            <dt style={{ color: "var(--mist)" }}>Duration</dt>
            <dd style={{ margin: 0 }}>{course.duration}</dd>
            <dt style={{ color: "var(--mist)" }}>Intake</dt>
            <dd style={{ margin: 0 }}>{course.intake} seats</dd>
          </dl>
          <Link to="/admissions" className="btn btn-primary" style={{ marginTop: 32 }}>Apply for this Program</Link>
        </div>
      </section>
    </>
  );
}
