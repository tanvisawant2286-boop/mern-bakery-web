import { useState } from "react";
import { Link } from "react-router-dom";
import { Field } from "../components/FormFields.jsx";
import LocationPicker from "../components/LocationPicker.jsx";
import { useBakery } from "../context/BakeryContext.jsx";
import useBakeryApi from "../services/useBakeryApi.js";

const money = value => `Rs. ${Number(value).toFixed(2)}`;

export default function Checkout() {
  const { cart, setCart } = useBakery();
  const { submitOrder } = useBakeryApi();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info");
  const [whatsappNotification, setWhatsappNotification] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [location, setLocation] = useState(null);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const changeQuantity = (id, quantity) => setCart(items => items.map(item => item.id === id ? { ...item, quantity: Math.max(1, Math.min(50, Number(quantity) || 1)) } : item));
  const send = async event => {
    event.preventDefault();
    if (!cart.length) {
      setStatus("Your cart is empty. Add something delicious from the menu first.");
      setStatusType("danger");
      return;
    }
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setBusy(true);
    setStatus("");
    setStatusType("info");
    setWhatsappNotification(null);
    setWhatsappUrl("");
    const values = Object.fromEntries(new FormData(form));
    try {
      const result = await submitOrder({ ...values, location, items: cart.map(item => ({ productId: item.id, quantity: item.quantity })) });
      setStatus(result.message);
      setStatusType(result.ok ? "success" : "danger");
      if (result.ok) {
        setCart([]);
        setLocation(null);
        form.reset();
        setWhatsappNotification(result.whatsappNotification);
        setWhatsappUrl(result.whatsappUrl || "");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not place your order. Please try again.");
      setStatusType("danger");
    } finally {
      setBusy(false);
    }
  };

  return <main className="container py-5"><section className="mb-4"><p className="hero-kicker text-accent mb-2">// Almost there</p><h1 className="section-title mb-2">Your Cart & Checkout</h1><p className="text-muted-custom">Review your selected products and place your order.</p></section>
    <div className="row g-4"><div className="col-lg-8"><div className="glass-card p-4"><div className="table-responsive"><table className="table align-middle mb-0">
      <thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Total</th><th>Action</th></tr></thead>
      <tbody>{cart.length ? cart.map(item => <tr key={item.id}><td>{item.name}</td><td>{money(item.price)}</td><td><input className="form-control cart-qty" type="number" min="1" max="50" value={item.quantity} aria-label={`Quantity for ${item.name}`} onChange={event => changeQuantity(item.id, event.target.value)} /></td><td>{money(item.price * item.quantity)}</td><td><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setCart(items => items.filter(row => row.id !== item.id))}>Remove</button></td></tr>) : <tr><td colSpan="5" className="text-center text-muted-custom py-4">Your cart is empty. <Link to="/menu">Browse the menu</Link>.</td></tr>}</tbody>
    </table></div><div className="d-flex justify-content-end pt-3"><h5>Grand Total: {money(total)}</h5></div></div></div>
    <div className="col-lg-4"><form className="glass-card p-4" onSubmit={send} noValidate><h4 className="section-title mb-3">Checkout Details</h4>
      {status && <div className={`alert ${statusType === "danger" ? "alert-danger" : statusType === "success" ? "alert-success" : "alert-info"}`} role="status">
        <p className="mb-0">{status}</p>
        {whatsappNotification && <p className={`mb-0 mt-2 ${whatsappNotification.status === "sent" ? "text-success" : whatsappNotification.status === "not_configured" ? "text-muted-custom" : "text-danger"}`}>{whatsappNotification.message}</p>}
        {whatsappUrl && <div className="mt-3">
          <p>Your order is saved. Tap below to open WhatsApp and send the order details to the bakery.</p>
          <a className="btn btn-success w-100 rounded-pill" href={whatsappUrl} target="_blank" rel="noreferrer">Send order to bakery on WhatsApp</a>
          <small className="d-block mt-2">WhatsApp will show the message; tap <strong>Send</strong> there to notify the bakery.</small>
        </div>}
      </div>}
      <div className="mb-3"><Field label="Full Name" name="name" required /></div><div className="mb-3"><Field label="Phone Number" name="phone" type="tel" pattern="[0-9]{10}" title="Enter a 10-digit phone number without spaces or country code." inputMode="numeric" maxLength={10} placeholder="10-digit phone number" required /></div><div className="mb-3"><Field label="Delivery Address" name="address" textarea required /></div>
      <div className="mb-3"><label className="form-label">Delivery location <small className="text-muted-custom">(optional)</small></label><LocationPicker location={location} setLocation={setLocation} /><small className="text-muted-custom">Click the map or use your location to pin your delivery address.</small></div>
      <button className="btn premium-btn w-100 rounded-pill" type="submit" disabled={busy}>{busy ? "Placing order..." : "Place Order"}</button>
    </form></div></div>
  </main>;
}
