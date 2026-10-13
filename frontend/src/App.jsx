import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import { BakeryProvider, useBakery } from "./context/BakeryContext.jsx";
import About from "./pages/About.jsx";
import Checkout from "./pages/Checkout.jsx";
import Contact from "./pages/Contact.jsx";
import CustomOrder from "./pages/CustomOrder.jsx";
import Feedback from "./pages/Feedback.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import NotFound from "./pages/NotFound.jsx";

function Storefront() {
  const { databaseReady, notice, setNotice } = useBakery();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <>
    <Navbar />
    {!databaseReady && <div className="container pt-3"><div className="alert alert-warning mb-0" role="status">
      <strong>Preview mode:</strong> The sample menu is visible, but MongoDB features are paused. Add your Atlas connection string to <code>backend/.env</code> and restart the server.
    </div></div>}
    {notice && <div className="container pt-3"><div className="alert alert-info alert-dismissible mb-0" role="status">
      {notice}<button type="button" className="btn-close" aria-label="Dismiss" onClick={() => setNotice("")} />
    </div></div>}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/custom-order" element={<CustomOrder />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/order" element={<Checkout />} />
      <Route path="/about.html" element={<Navigate to="/about" replace />} />
      <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
      <Route path="/feedback.html" element={<Navigate to="/feedback" replace />} />
      <Route path="/menu.html" element={<Navigate to="/menu" replace />} />
      <Route path="/order.html" element={<Navigate to="/order" replace />} />
      <Route path="/requirements.html" element={<Navigate to="/custom-order" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </>;
}

export default function App() {
  return <BakeryProvider><Storefront /></BakeryProvider>;
}
