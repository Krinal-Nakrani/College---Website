import PageHeader from "../components/PageHeader";

const STEPS = [
  { title: "Check eligibility", text: "SSC/HSC pass with required subjects and cut-off, per the program you are applying to." },
  { title: "Submit MSBTE / institute application", text: "Fill the centralized admission form and upload marksheets and ID proof." },
  { title: "Document verification", text: "Visit campus or the designated facilitation centre with original documents." },
  { title: "Seat confirmation & fee payment", text: "Confirm your allotted seat and pay the first-installment fee to lock admission." },
];

export default function Admissions() {
  return (
    <>
      <PageHeader
        eyebrow="Admissions 2026–27"
        title="How to apply"
        lede="Diploma seats are allotted through MSBTE's centralized admission process; degree seats follow the state CAP round. Both are outlined below."
      />
      <section className="section">
        <div className="container">
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 28, maxWidth: 640 }}>
            {STEPS.map((s, i) => (
              <li key={s.title} style={{ display: "flex", gap: 18 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--amber)",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <strong style={{ display: "block", fontFamily: "var(--font-display)", color: "var(--ink)", marginBottom: 4 }}>
                    {s.title}
                  </strong>
                  <p style={{ margin: 0, color: "var(--mist)" }}>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div style={{ marginTop: 48, borderTop: "1px solid var(--mist-light)", paddingTop: 32 }}>
            <h2 style={{ fontSize: "1.4rem", marginBottom: 16 }}>Have a question about eligibility?</h2>
            <a href="/contact" className="btn btn-primary">Talk to Admissions</a>
          </div>
        </div>
      </section>
    </>
  );
}
