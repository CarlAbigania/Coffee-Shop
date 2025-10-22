import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useReveal } from '../hooks/useReveal';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  // Reveal animation refs
  const aboutTextRef = useReveal();
  const aboutImageRef = useReveal();
  const feature1Ref = useReveal();
  const feature2Ref = useReveal();
  const feature3Ref = useReveal();
  const card1Ref = useReveal();
  const card2Ref = useReveal();
  const card3Ref = useReveal();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      // Use Vite dev proxy: avoids CORS in development
      const response = await axios.post('/api/index.php?route=subscribe', {
        email: email
      });

      if (response.data.success) {
        setMessage('Subscription successful! Thank you for joining us.');
        setMessageType('success');
        setEmail('');
      } else {
        setMessage(response.data.message || 'Subscription failed. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again later.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <div className="hero-panel">
            <div className="overlay"></div>
            <div className="hero-content">
              <span className="hero-badge">No Cap • Since 2025</span>
              <h1>Freshly Brewed Happiness</h1>
              <p>Crafted with passion, served with love.</p>
              <div className="hero-actions">
                <Link to="/menu" className="btn">Explore Our Menu</Link>
                <a href="#about" className="btn btn-outline">Learn Our Story</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container about-grid">
          <div className="about-text reveal" ref={aboutTextRef}>
            <h2>Our Story</h2>
            <p>
              At No Cap, we believe that coffee is more than a drink—it's an
              experience. Each cup is brewed from ethically sourced beans, roasted
              to perfection, and served with a smile that warms your day.
            </p>
            <div className="stats">
              <div className="stat">
                <strong>50k+</strong>
                <span>Cups Served</span>
              </div>
              <div className="stat">
                <strong>100%</strong>
                <span>Fresh Beans</span>
              </div>
              <div className="stat">
                <strong>5⭐</strong>
                <span>Community Rated</span>
              </div>
            </div>
          </div>
          <div className="about-image reveal" ref={aboutImageRef}>
            <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop" alt="Coffee beans and latte art" />
          </div>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true"></div>

      {/* Features Section */}
      <section className="features">
        <div className="container features-grid">
          <div className="feature reveal" ref={feature1Ref}>
            <div className="icon">🌱</div>
            <h3>Ethically Sourced</h3>
            <p>Beans from sustainable farms for a richer, kinder brew.</p>
          </div>
          <div className="feature reveal" ref={feature2Ref}>
            <div className="icon">🔥</div>
            <h3>Small-Batch Roasted</h3>
            <p>Roasted in small batches to unlock complex flavor notes.</p>
          </div>
          <div className="feature reveal" ref={feature3Ref}>
            <div className="icon">💬</div>
            <h3>Community First</h3>
            <p>A cozy space where conversations are as warm as the coffee.</p>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="featured">
        <div className="container">
          <div className="section-head">
            <h2>Featured Brews</h2>
            <p>Handpicked favorites to start your day right.</p>
          </div>
          <div className="featured-grid">
            <div className="featured-card reveal" ref={card1Ref}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrjyHlkViXf1t9FlpAnmlozT9DZSvPbFi-Lg&s" alt="Espresso" />
              <div className="card-body">
                <h3>Espresso</h3>
                <span className="pill">₱30.00</span>
              </div>
            </div>
            <div className="featured-card reveal" ref={card2Ref}>
              <img src="https://static.vecteezy.com/system/resources/thumbnails/049/632/997/small_2x/heart-shaped-latte-art-in-a-white-cup-with-coffee-beans-isolated-on-wooden-table-side-view-of-taiwan-baked-food-photo.jpg" alt="Latte" />
              <div className="card-body">
                <h3>Latte</h3>
                <span className="pill">₱40.00</span>
              </div>
            </div>
            <div className="featured-card reveal" ref={card3Ref}>
              <img src="https://media.istockphoto.com/id/157675911/photo/cappuccino-topped-with-swirls-of-chocolate-sauce.jpg?s=612x612&w=0&k=20&c=606NMYMjVnTmpSnJI537_IjW3lqfNJaH7Lc9Qg0BXPU=" alt="Mocha" />
              <div className="card-body">
                <h3>Mocha</h3>
                <span className="pill">₱40.75</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="newsletter">
        <div className="container newsletter-container">
          <h2>Stay in the Loop</h2>
          <p>Subscribe for exclusive offers, updates, and brewing inspiration.</p>
          <form id="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              id="newsletter-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-invalid={messageType === 'error' ? 'true' : 'false'}
              required
              disabled={isSubmitting}
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
            <small id="newsletter-error" className={`error-text ${message ? 'is-visible' : ''} ${messageType === 'success' ? 'success' : messageType === 'error' ? 'error' : ''}`} role="status">
              {message}
            </small>
          </form>
        </div>
      </section>
    </>
  );
};

export default HomePage;
