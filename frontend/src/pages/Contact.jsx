import { useState } from "react";
import { Field } from "../components/FormFields.jsx";
import FormPanel from "../components/FormPanel.jsx";
import useBakeryApi from "../services/useBakeryApi.js";

export default function Contact() {
  const { submitForm } = useBakeryApi();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const send = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setStatus("");
    const result = await submitForm("contact", Object.fromEntries(new FormData(form)));
    setBusy(false);
    setStatus(result.message);
    if (result.ok) form.reset();
  };

  return <main className="container py-5"><div className="row g-4">
    <div className="col-lg-5"><div className="glass-card p-4 h-100"><p className="hero-kicker text-accent mb-2">// Say hello</p><h2 className="section-title">Contact Us</h2><p className="text-muted-custom">We would love to bake for your next celebration. Send us a message and our team will get back to you.</p><p><i className="bi bi-geo-alt-fill me-2" />In Front Of Tasgaon Bus Stand</p><p><a href="tel:+918669112305" className="contact-link"><i className="bi bi-telephone-fill me-2" />+91 8669112305</a></p><a className="btn soft-btn rounded-pill" href="https://www.google.com/maps/search/?api=1&query=Quality+Bakery+Tasgaon" target="_blank" rel="noreferrer">Get Directions</a></div></div>
    <div className="col-lg-7"><FormPanel title="Send us a message" description="We’ll reply as soon as we can." onSubmit={send} busy={busy} submitLabel="Send Message">
      {status && <p className="alert alert-light" role="status">{status}</p>}
      <div className="row g-3"><Field label="Name" name="name" required /><Field label="Phone" name="phone" type="tel" pattern="[0-9]{10}" required /><Field label="Email" name="email" type="email" required /><Field label="Message" name="message" textarea required /></div>
    </FormPanel></div>
    <div className="col-12"><div className="glass-card p-3"><h4 className="section-title"><i className="bi bi-geo-alt-fill" /> Find Us</h4><iframe className="map-frame" title="Quality Bakery on a map" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=74.58%2C17.02%2C74.62%2C17.05&layer=mapnik&marker=17.0345%2C74.6005" /></div></div>
  </div></main>;
}
