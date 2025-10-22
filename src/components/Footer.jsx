import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="Go to Home">
            ☕ <span>No <strong>Cap</strong></span>
          </Link>
          <p className="footer-desc">
            Freshly brewed happiness, crafted with passion and served with love.
          </p>
          <div className="socials" aria-label="Social media links">
            <a href="#" className="social-icon" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.01 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.91h-2.32V22c4.78-.78 8.44-4.93 8.44-9.94z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7zm5.75-.75a1.25 1.25 0 1 1 0 2.5a1.25 1.25 0 0 1 0-2.5z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter" title="Twitter">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 5.92c-.74.33-1.54.55-2.38.65c.86-.51 1.52-1.32 1.83-2.28c-.8.47-1.68.81-2.62.99c-.76-.81-1.85-1.32-3.06-1.32c-2.31 0-4.18 1.87-4.18 4.18c0 .33.04.65.11.96C8.03 9.93 5.1 8.34 3.18 5.92c-.36.62-.56 1.33-.56 2.09c0 1.45.74 2.73 1.87 3.48c-.69-.02-1.33-.21-1.89-.52v.05c0 2.03 1.45 3.73 3.37 4.12c-.35.1-.73.16-1.12.16c-.27 0-.53-.03-.78-.07c.53 1.66 2.08 2.86 3.91 2.89c-1.43 1.12-3.23 1.79-5.19 1.79c-.34 0-.68-.02-1.01-.06c1.85 1.19 4.05 1.88 6.41 1.88c7.69 0 11.9-6.37 11.9-11.9l-.01-.54c.82-.59 1.52-1.33 2.08-2.17z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/locations">Locations</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <ul>
            <li>Email: <a href="mailto:hello@nocap.cafe">hello@nocap.cafe</a></li>
            <li>Phone: <a href="tel:+639942152471">+63 994 215 2471</a></li>
            <li>Hours: Mon–Sun, 7:00 AM – 9:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="footer-separator" aria-hidden="true"></div>
      <div className="footer-bottom">
        <p>&copy; 2025 No Cap. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
