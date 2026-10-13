export default function Loading({ label = "Loading..." }) {
  return <div className="loading-state" role="status">
    <span className="spinner-border spinner-border-sm text-danger" aria-hidden="true" />
    <span>{label}</span>
  </div>;
}
