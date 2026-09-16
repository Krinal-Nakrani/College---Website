import "../styles/quickfacts.css";

const FACTS = [
  { value: "6", label: "Diploma & Degree Programs" },
  { value: "1,800+", label: "Students on Campus" },
  { value: "82%", label: "Average Placement Rate" },
  { value: "27", label: "Years of Operation" },
];

export default function QuickFacts() {
  return (
    <div className="quickfacts">
      <div className="container quickfacts__row">
        {FACTS.map((f) => (
          <div className="quickfacts__item" key={f.label}>
            <span className="quickfacts__value">{f.value}</span>
            <span className="quickfacts__label">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
