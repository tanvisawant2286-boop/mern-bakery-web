export default function Footer() {
  return <footer className="footer-wrap mt-5 py-5">
    <div className="container">
      <div className="row g-4">
        <div className="col-md-4"><h5>Quality Bakery</h5><p className="small mb-1">In Front Of Tasgaon Bus Stand</p><a className="footer-link small" href="tel:+918669112305">+91 8669112305</a><br /><a className="footer-link small" href="mailto:saiprarthanavijay123@gmail.com">saiprarthanavijay123@gmail.com</a></div>
        <div className="col-md-4"><h6>Opening Hours</h6><p className="small mb-1">Mon-Sun: 6:00 AM - 10:00 PM</p></div>
        <div className="col-md-4"><h6>Made fresh every day</h6><p className="small mb-0">Handcrafted cakes, pastries, and breads for your sweetest moments.</p></div>
      </div>
      <hr className="footer-rule" /><p className="small mb-0 text-center">© {new Date().getFullYear()} Quality Bakery</p>
    </div>
  </footer>;
}
