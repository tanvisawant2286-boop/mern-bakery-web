import { useState } from "react";
import { Field, SelectField } from "../components/FormFields.jsx";
import LocationPicker from "../components/LocationPicker.jsx";
import useBakeryApi from "../services/useBakeryApi.js";

export default function CustomOrder() {
  const { submitForm } = useBakeryApi();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState(null);
  const send = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    data.eggless = form.elements.eggless.checked;
    data.location = location;
    setBusy(true);
    setStatus("");
    const result = await submitForm("requirement", data);
    setBusy(false);
    setStatus(result.message);
    if (result.ok) { form.reset(); setLocation(null); }
  };

  return <main className="container py-5"><p className="hero-kicker text-accent mb-2">// Custom Orders</p>
    <h1 className="section-title mb-2">Tell Us What You Need</h1><p className="text-muted-custom mb-4">Describe your dream cake or treat. Our team will get back to you with a quote.</p>
    <form className="row g-4" onSubmit={send}><div className="col-lg-7"><div className="glass-card p-4"><h5 className="section-title mb-3">Your Details</h5><div className="row g-3">
      <Field label="Full Name" name="name" required /><Field label="Phone" name="phone" type="tel" pattern="[0-9]{10}" required />
      <SelectField label="Occasion" name="occasion" values={["Birthday", "Wedding", "Anniversary", "Baby Shower", "Corporate Event", "Festival", "Other"]} />
      <SelectField label="Item" name="itemType" values={["Cake", "Cupcakes", "Pastries", "Brownies / Desserts", "Breads", "Gift Box / Hamper", "Other"]} />
      <SelectField label="Flavour" name="flavour" values={["Chocolate Truffle", "Vanilla", "Butterscotch", "Black Forest", "Red Velvet", "Pineapple", "Fruit", "Other"]} />
      <Field label="Weight / Quantity" name="weight" placeholder="e.g. 1 kg or 12 pieces" required />
      <SelectField label="Shape" name="shape" values={["Round", "Square", "Heart", "Rectangle", "Tiered", "Custom"]} optional />
      <div className="col-12"><div className="form-check"><input className="form-check-input" type="checkbox" name="eggless" id="eggless" /><label className="form-check-label" htmlFor="eggless">Eggless</label></div></div>
      <Field label="Message on cake (optional)" name="cakeMessage" />
      <Field label="Design / theme / special instructions" name="design" textarea required />
    </div></div></div>
    <div className="col-lg-5"><div className="glass-card p-4"><h5 className="section-title mb-3">When & Where</h5><div className="row g-3">
      <Field label="Needed On" name="date" type="date" min={new Date().toISOString().slice(0, 10)} required /><Field label="Time" name="time" type="time" required />
      <SelectField label="Budget (optional)" name="budget" values={["Not sure", "Under Rs. 500", "Rs. 500 - 1000", "Rs. 1000 - 3000", "Rs. 3000 - 6000", "Rs. 6000+"]} optional />
      <div className="col-12"><label className="form-label">Pickup or Delivery</label><select className="form-select" name="delivery"><option>Store Pickup</option><option>Home Delivery</option></select></div>
      <div className="col-12"><label className="form-label">Delivery location (optional)</label><LocationPicker location={location} setLocation={setLocation} /><small className="text-muted-custom">Click the map or use your location to set a delivery pin.</small></div>
      {status && <div className="col-12"><p className="alert alert-light mb-0" role="status">{status}</p></div>}
      <div className="visually-hidden" aria-hidden="true"><label>Leave blank<input name="website" tabIndex="-1" autoComplete="off" /></label></div>
      <div className="col-12"><button className="btn premium-btn w-100 rounded-pill" type="submit" disabled={busy}>{busy ? "Sending..." : "Send Custom Request"}</button></div>
    </div></div></div></form>
  </main>;
}
