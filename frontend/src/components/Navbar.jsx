import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useBakery } from "../context/BakeryContext.jsx";

export default function Navbar() {
  const { cart, theme, setTheme } = useBakery();
  const [expanded, setExpanded] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const links = [
    ["/", "Home"], ["/menu", "Menu"], ["/about", "About"], ["/contact", "Contact"],
    ["/custom-order", "Custom Order"], ["/feedback", "Feedback"]
  ];

  return <nav className="navbar navbar-expand-lg sticky-top navbar-glass">
    <div className="container py-2">
      <Link className="navbar-brand fw-bold brand-name" to="/">Quality Bakery</Link>
      <button className="navbar-toggler" type="button" aria-label="Toggle navigation" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
        <span className="navbar-toggler-icon" />
      </button>
      <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`}>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
          {links.map(([path, label]) => <li className="nav-item" key={path}>
            <NavLink end={path === "/"} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to={path} onClick={() => setExpanded(false)}>{label}</NavLink>
          </li>)}
          <li className="nav-item"><NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/order" onClick={() => setExpanded(false)}>Cart <span className="badge bg-dark">{cartCount}</span></NavLink></li>
          <li className="nav-item"><button className="btn soft-btn rounded-pill btn-sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "Light Mode" : "Dark Mode"}</button></li>
        </ul>
      </div>
    </div>
  </nav>;
}
