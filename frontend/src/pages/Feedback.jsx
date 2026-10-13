import { useState } from "react";
import { Field, SelectField } from "../components/FormFields.jsx";
import FormPanel from "../components/FormPanel.jsx";
import useBakeryApi from "../services/useBakeryApi.js";

export default function Feedback() {
  const { submitForm } = useBakeryApi();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const send = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    data.rating = Number(data.rating);
    setBusy(true);
    setStatus("");
    const result = await submitForm("feedback", data);
    setBusy(false);
    setStatus(result.message);
    if (result.ok) form.reset();
  };

  return <main className="container py-5"><div className="row justify-content-center"><div className="col-lg-7">
    <FormPanel title="Share Your Feedback" description="Tell us about your order. Your feedback helps us make every visit sweeter." onSubmit={send} busy={busy} submitLabel="Submit Feedback">
      {status && <p className="alert alert-light" role="status">{status}</p>}
      <div className="row g-3"><Field label="Your Name" name="name" required /><Field label="Phone (optional)" name="phone" type="tel" pattern="[0-9]{10}" />
        <div className="col-12"><label className="form-label d-block">How was your experience?</label><div className="star-rating">{[5, 4, 3, 2, 1].map(value => <span key={value}><input type="radio" id={`star-${value}`} name="rating" value={value} required /><label htmlFor={`star-${value}`} title={`${value} stars`}>★</label></span>)}</div></div>
        <SelectField label="What is this about?" name="topic" values={["Taste & Quality", "Delivery", "Packaging", "Service & Staff", "Price", "Other"]} />
        <SelectField label="Would you recommend us?" name="recommend" values={["Yes", "Maybe", "No"]} />
        <Field label="Your Feedback" name="message" textarea required />
      </div>
    </FormPanel>
  </div></div></main>;
}
