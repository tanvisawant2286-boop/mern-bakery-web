import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useBakery } from "../context/BakeryContext.jsx";

export default function Home() {
  const { products } = useBakery();
  return <main className="container py-4">
    <section className="hero-banner px-4 px-md-5 reveal show">
      <div className="text-white col-lg-7"><p className="text-uppercase tracking-widest mb-2 hero-kicker">// Fresh from our oven</p>
        <h1 className="display-4 fw-bold">We Bake With Passion</h1>
        <p className="lead">Bringing you handcrafted cakes baked with love and sprinkled with joy for every celebration.</p>
        <div className="d-flex flex-wrap gap-3 mt-4"><Link to="/menu" className="btn premium-btn rounded-pill px-4 py-2">Explore Menu</Link><Link to="/order" className="btn btn-light rounded-pill px-4 py-2">Order Now</Link></div>
      </div>
    </section>
    <section className="py-4"><div className="row g-3">
      {[["Fresh", "Baked every morning"], ["Made with care", "Quality ingredients"], ["For every moment", "Custom celebration cakes"], ["Right here", "Tasgaon, Maharashtra"]].map(([title, text]) =>
        <div className="col-6 col-lg-3" key={title}><div className="glass-card stat-card text-center p-3 h-100"><p className="small text-muted-custom mb-1">{text}</p><h3 className="mb-0">{title}</h3></div></div>)}
    </div></section>
    <section className="py-5"><div className="row g-4 align-items-center">
      <div className="col-lg-6"><div className="glass-card p-4 p-md-5 h-100"><p className="hero-kicker mb-2 text-accent">// About us</p><h2 className="section-title">We bake every item from the core of our hearts</h2><p className="text-muted-custom mb-4">Each treat is made with care, quality ingredients, and expert craftsmanship. From our kitchen to yours, we serve warmth in every bite.</p><Link to="/about" className="btn premium-btn rounded-pill px-4">Our Story</Link></div></div>
      <div className="col-lg-6"><img src="https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=1200&q=80" alt="Fresh premium pastries" className="img-fluid rounded-4 shadow" loading="lazy" /></div>
    </div></section>
    <section className="py-5"><div className="d-flex justify-content-between align-items-center mb-4"><h2 className="section-title mb-0">Featured Products</h2><Link to="/menu" className="text-decoration-none text-accent fw-semibold">View all items</Link></div>
      <div className="row g-4">{products.slice(0, 3).map(product => <ProductCard key={product.id} product={product} compact />)}</div>
    </section>
    <section className="pb-4"><div className="offer-box glass-card p-4 p-md-5"><p className="hero-kicker text-accent mb-2">// Made for your celebration</p><h2 className="section-title">Have a cake in mind?</h2><p className="text-muted-custom">Share your flavor, design, and delivery details. We’ll get back to you with a custom quote.</p><Link to="/custom-order" className="btn premium-btn rounded-pill px-4">Plan a Custom Order</Link></div></section>
  </main>;
}
