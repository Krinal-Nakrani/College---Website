import { useState } from "react";
import "../styles/testimonials.css";

const QUOTES = [
  { quote: "The workshop hours mattered more than I expected — by third year I'd already built two working projects on my own.", name: "Sanika Patil", course: "Diploma, Computer Engineering" },
  { quote: "Faculty here still work with industry, so the examples in class were never out of date.", name: "Rohit Jadhav", course: "Diploma, Mechanical Engineering" },
  { quote: "Placement training started in second year, which gave me time to actually fix my weak spots before interviews.", name: "Ayesha Sheikh", course: "Diploma, Electrical Engineering" },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const t = QUOTES[active];

  return (
    <section className="section testimonials">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="kicker">Student Voices</span>
            <h2>What studying here is actually like</h2>
          </div>
        </div>

        <div className="testimonials__card">
          <p className="testimonials__quote">&ldquo;{t.quote}&rdquo;</p>
          <div className="testimonials__byline">
            <strong>{t.name}</strong>
            <span>{t.course}</span>
          </div>
        </div>

        <div className="testimonials__dots">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              aria-label={`Show testimonial ${i + 1}`}
              className={i === active ? "is-active" : ""}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
