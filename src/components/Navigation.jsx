import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ cart }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className={isScrolled ? 'scrolled' : ''}>
      <div className="logo">
        <span className="logo-mark">☕</span>
        <span className="logo-text">No <strong>Cap</strong></span>
      </div>
      
      <button 
        className="nav-toggle" 
        onClick={toggleNav}
        aria-label="Toggle navigation" 
        aria-expanded={isNavOpen} 
        aria-controls="primary-navigation"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      
      <div className={`nav-links ${isNavOpen ? 'nav-open' : ''}`} id="primary-navigation">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''}
          onClick={closeNav}
        >
          Home
        </Link>
        <Link 
          to="/locations" 
          className={location.pathname === '/locations' ? 'active' : ''}
          onClick={closeNav}
        >
          Locations
        </Link>
        <Link 
          to="/contact" 
          className={location.pathname === '/contact' ? 'active' : ''}
          onClick={closeNav}
        >
          Contact
        </Link>
        <Link 
          to="/menu" 
          className="btn-nav"
          onClick={closeNav}
        >
          Order Now
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
