import "../styles/pageheader.css";

export default function PageHeader({ eyebrow, title, lede }) {
  return (
    <section className="pageheader">
      <div className="pageheader__grid" aria-hidden="true" />
      <div className="container">
        {eyebrow && <span className="pageheader__eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {lede && <p>{lede}</p>}
      </div>
    </section>
  );
}
