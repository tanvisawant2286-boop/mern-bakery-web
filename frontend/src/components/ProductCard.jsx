import { useBakery } from "../context/BakeryContext.jsx";

const money = value => `Rs. ${Number(value).toFixed(2)}`;

export default function ProductCard({ product, compact = false }) {
  const { setCart, setNotice } = useBakery();
  const add = () => {
    setCart(current => {
      const found = current.find(item => item.id === product.id);
      return found
        ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} added to your cart.`);
  };
  return <div className={compact ? "col-md-4" : "col-md-6 col-lg-4"}>
    <article className="glass-card p-3 h-100 product-card">
      <div className="overflow-hidden rounded-4 mb-3"><img src={product.image} alt={product.name} className="product-image" loading="lazy" /></div>
      <div className="d-flex justify-content-between align-items-start gap-2">
        <div><h5 className="mb-1">{product.name}</h5><small className="text-muted-custom text-capitalize">{product.category}</small></div>
        <span className="badge rating-pill">{Number(product.rating).toFixed(1)} ★</span>
      </div>
      <p className="text-muted-custom mt-2 small mb-3">{product.description}</p>
      <div className="d-flex justify-content-between align-items-center mt-auto"><strong>{money(product.price)}</strong><button type="button" onClick={add} className="btn premium-btn rounded-pill px-3">Add to Cart</button></div>
    </article>
  </div>;
}
