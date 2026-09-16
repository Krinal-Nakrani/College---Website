import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { submitEnquiry } from "../api";
import "../styles/contact.css";

const initial = { name: "", email: "", phone: "", course: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitEnquiry(form);
      setStatus("sent");
      setForm(initial);
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Reach the admissions desk"
        lede="Send an enquiry and the admissions team will respond within one working day."
      />
      <section className="section">
        <div className="container contact__grid">
          <form className="contact__form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} />
            </label>
            <label>
              Email
              <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
            </label>
            <label>
              Phone
              <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </label>
            <label>
              Program interested in
              <input value={form.course} onChange={(e) => update("course", e.target.value)} placeholder="e.g. Diploma – Computer Engineering" />
            </label>
            <label>
              Message
              <textarea rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} />
            </label>

            <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send Enquiry"}
            </button>

            {status === "sent" && <p className="contact__status is-ok">Enquiry sent. We'll be in touch shortly.</p>}
            {status === "error" && <p className="contact__status is-error">Something went wrong — check the API is running and try again.</p>}
          </form>

          <div className="contact__info">
            <h2>Visit or write to us</h2>
            <p>Address: At Munde Educational Campus, Malangad Rd, Bhal Gaon, Gad Road, Kalyan, Maharashtra 421306</p>
            <p>admissions@nilkanthpolytechnic.edu.in</p>
            <p>+91 98200 00000</p>
            <p style={{ color: "var(--mist)", fontSize: "0.85rem", marginTop: 24 }}>
              Office hours: Monday–Saturday, 9:30 AM – 5:30 PM
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
