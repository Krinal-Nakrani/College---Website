import { Link } from "react-router-dom";
import "../styles/admissioncta.css";

export default function AdmissionCTA() {
  return (
    <section className="admissioncta">
      <div className="container admissioncta__inner">
        <div>
          <h2>Admissions for 2026–27 are open</h2>
          <p>Seats are allotted through the MSBTE centralized admission process. Talk to our admissions desk for eligibility and document guidance.</p>
        </div>
        <div className="admissioncta__actions">
          <Link to="/admissions" className="btn btn-primary">Start Application</Link>
          <Link to="/contact" className="btn btn-secondary">Talk to Admissions</Link>
        </div>
      </div>
    </section>
  );
}
