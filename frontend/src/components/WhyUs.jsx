import "../styles/whyus.css";

const POINTS = [
  { title: "Lab-first teaching", text: "Every theory unit is followed by a hands-on session in the same week, not at the end of the semester." },
  { title: "Faculty from industry", text: "Instructors carry recent industry experience alongside teaching qualifications." },
  { title: "Placement cell from year one", text: "Resume, aptitude and interview preparation start well before final semester." },
  { title: "MSBTE-aligned curriculum", text: "Syllabus and lab work are kept current with MSBTE's revised scheme." },
];

export default function WhyUs() {
  return (
    <section className="section whyus">
      <div className="container whyus__grid">
        <div className="whyus__media">
          <div className="whyus__media-inner" />
        </div>
        <div className="whyus__content">
          <span className="kicker">Why Nilkanth Polytechnic</span>
          <h2>Education measured by what students can do, not just what they can recall</h2>
          <ul className="whyus__list">
            {POINTS.map((p) => (
              <li key={p.title}>
                <span className="whyus__tick" aria-hidden="true">✓</span>
                <div>
                  <strong>{p.title}</strong>
                  <p>{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
