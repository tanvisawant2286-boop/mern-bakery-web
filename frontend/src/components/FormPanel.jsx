export default function FormPanel({ title, description, onSubmit, busy, children, submitLabel }) {
  return <form className="glass-card p-4 p-md-5" onSubmit={onSubmit}>
    <h1 className="section-title mb-2">{title}</h1><p className="text-muted-custom mb-4">{description}</p>
    {children}
    <div className="visually-hidden" aria-hidden="true"><label>Leave blank<input name="website" tabIndex="-1" autoComplete="off" /></label></div>
    <button className="btn premium-btn rounded-pill px-4 mt-3" type="submit" disabled={busy}>{busy ? "Sending..." : submitLabel}</button>
  </form>;
}
