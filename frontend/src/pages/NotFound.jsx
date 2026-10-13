import { Link } from "react-router-dom";

export default function NotFound() {
  return <main className="container py-5 text-center"><div className="glass-card p-5"><h1 className="section-title">Page not found</h1><p className="text-muted-custom">That page isn’t on today’s menu.</p><Link to="/" className="btn premium-btn rounded-pill px-4">Back to Home</Link></div></main>;
}
