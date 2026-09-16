import PageHeader from "../components/PageHeader";

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Technical education in Kalyan"
        lede="Nilkanth Polytechnic & Institute of Engineering was established to bring industry-aligned diploma and degree engineering education to students across the region."
      />
      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", marginBottom: 14 }}>Mission</h2>
            <p style={{ color: "var(--mist)" }}>
              To produce engineers who are workshop-ready, not just exam-ready —
              through curriculum that pairs every concept with hands-on
              practice, and faculty who stay connected to industry.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: "1.3rem", marginBottom: 14 }}>Approvals</h2>
            <p style={{ color: "var(--mist)" }}>
              Diploma programs are affiliated with the Maharashtra State Board
              of Technical Education (MSBTE). Degree programs are approved by
              AICTE and affiliated with the state technical university.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
