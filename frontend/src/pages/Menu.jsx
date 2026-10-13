import { useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { useBakery } from "../context/BakeryContext.jsx";

export default function Menu() {
  const { products } = useBakery();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = products.filter(product => (category === "all" || product.category === category) && product.name.toLowerCase().includes(search.toLowerCase()));
  return <main className="container py-5">
    <section className="glass-card p-4 p-md-5"><p className="hero-kicker text-accent mb-2">// Baked fresh daily</p><h1 className="section-title mb-3">Our Premium Menu</h1><p className="text-muted-custom mb-4">Find your favorites and add them to your cart.</p>
      <div className="row g-3 align-items-center"><div className="col-lg-5"><input type="search" className="form-control search-input" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by product name" aria-label="Search products" /></div>
        <div className="col-lg-7 d-flex flex-wrap gap-2">{["all", "cakes", "pastries", "breads"].map(item => <button key={item} onClick={() => setCategory(item)} className={`btn soft-btn rounded-pill filter-btn ${category === item ? "active" : ""}`}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div></div>
    </section>
    <section className="mt-4"><div className="row g-4">{filtered.length ? filtered.map(product => <ProductCard key={product.id} product={product} />) : <div className="col-12"><div className="glass-card p-5 text-center text-muted-custom">No products matched your search.</div></div>}</div></section>
  </main>;
}
