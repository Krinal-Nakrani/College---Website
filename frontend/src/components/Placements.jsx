import "../styles/placements.css";

const STEPS = [
  { title: "Career mapping", text: "Second-year students meet the placement cell to identify a target industry and skill gaps." },
  { title: "Skill & interview training", text: "Structured aptitude, communication and mock-interview sessions ahead of recruitment drives." },
  { title: "Industry drives", text: "On-campus and pooled drives with recurring recruiters across each department." },
];

export default function Placements() {
  return (
    <section className="section placements">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="kicker">Placements</span>
            <h2>Placement preparation runs through all three years</h2>
          </div>
        </div>

        <ol className="placements__steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="placements__num">{i + 1}</span>
              <div>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
