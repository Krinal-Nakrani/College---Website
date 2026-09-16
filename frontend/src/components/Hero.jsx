import { Link } from "react-router-dom";
import "../styles/hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__grid" aria-hidden="true" />
      <div className="container hero__content">
        <h1>
          Diploma &amp; engineering
          <br />
          programs built on
          <br />
          practical skill.
        </h1>
        <p className="hero__lede">
          Nilkanth Polytechnic trains students on real lab equipment and live
          project work from year one — not just for exams, but for the job
          that follows.
        </p>
        <div className="hero__actions">
          <Link to="/courses" className="btn btn-primary">Explore Programs</Link>
          <Link to="/admissions" className="btn btn-secondary">Download Brochure</Link>
        </div>
        <p className="hero__meta">MSBTE Affiliated. AICTE Approved. Established 1998.</p>
      </div>
    </section>
  );
}
