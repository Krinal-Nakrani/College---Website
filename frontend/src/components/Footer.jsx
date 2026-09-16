import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__col footer__brand">
          <span className="footer__mark">NP</span>
          <p>
            Nilkanth Polytechnic &amp; Institute of Engineering offers MSBTE-affiliated
            diploma programs and AICTE-approved degree engineering, built around
            workshop-first, practical learning.
          </p>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <Link to="/about">About the Institute</Link>
          <Link to="/courses">Programs</Link>
          <Link to="/admissions">Admissions</Link>
          <Link to="/notices">Notices &amp; Circulars</Link>
        </div>

        <div className="footer__col">
          <h4>Students</h4>
          <Link to="/notices">Exam Timetables</Link>
          <Link to="/courses">Placements</Link>
          <Link to="/contact">Grievance Redressal</Link>
          <Link to="/contact">Scholarships</Link>
        </div>

        <div className="footer__col">
          <h4>Reach Us</h4>
          <p>Address: At Munde Educational Campus, Malangad Rd, Bhal Gaon, Gad Road, Kalyan, Maharashtra 421306</p>
          <p>admissions@nilkanthpolytechnic.edu.in</p>
          <p>+91 98200 00000</p>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Nilkanth Polytechnic &amp; Institute of Engineering. All rights reserved.</span>
        <span>MSBTE Affiliated. AICTE Approved.</span>
      </div>
    </footer>
  );
}
