export function Field({ label, name, type = "text", required = false, textarea = false, pattern, placeholder, min }) {
  const id = `field-${name}`;
  return <div className={textarea ? "col-12" : "col-md-6"}><label className="form-label" htmlFor={id}>{label}</label>
    {textarea
      ? <textarea className="form-control" id={id} name={name} rows="4" required={required} placeholder={placeholder} />
      : <input className="form-control" id={id} name={name} type={type} required={required} pattern={pattern} placeholder={placeholder} min={min} />}
  </div>;
}

export function SelectField({ label, name, values, optional = false }) {
  return <div className="col-md-6"><label className="form-label" htmlFor={`field-${name}`}>{label}</label>
    <select className="form-select" id={`field-${name}`} name={name} required={!optional}>
      {!optional && <option value="">Choose...</option>}
      {values.map(value => <option key={value} value={value}>{value}</option>)}
    </select>
  </div>;
}
