import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { useReveal } from '../hooks/useReveal';

const MenuPage = ({ cart, addToCart, updateQuantity, clearCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [showEmptyCartWarning, setShowEmptyCartWarning] = useState(false);

  // Scoped reveal observer (avoids per-item refs conflicts)
  const coffeeGridRef = useRef(null);
  const foodGridRef = useRef(null);

  const categories = ['all', 'coffee', 'food', 'bestseller'];

  // Move menuData outside component or use useMemo to prevent recreation
  const menuData = useMemo(() => [
    // Coffee & Beverages
    {
      id: 1,
      name: 'Espresso',
      price: 30.00,
      category: 'coffee',
      description: 'A concentrated shot of coffee crowned with rich crema.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrjyHlkViXf1t9FlpAnmlozT9DZSvPbFi-Lg&s',
      rating: 4.8,
      meta: 'Strong & bold',
      isBestSeller: true
    },
    {
      id: 2,
      name: 'Cappuccino',
      price: 40.50,
      category: 'coffee',
      description: 'Espresso with equal parts steamed milk and velvety milk foam.',
      image: 'https://media.istockphoto.com/id/505168330/photo/cup-of-cafe-latte-with-coffee-beans-and-cinnamon-sticks.jpg?s=612x612&w=0&k=20&c=h7v8kAfWOpRapv6hrDwmmB54DqrGQWxlhP_mTeqTQPA=',
      rating: 4.6,
      meta: 'Foamy & smooth'
    },
    {
      id: 3,
      name: 'Latte',
      price: 40.00,
      category: 'coffee',
      description: 'Espresso mellowed with plenty of steamed milk and a light cap of foam.',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/049/632/997/small_2x/heart-shaped-latte-art-in-a-white-cup-with-coffee-beans-isolated-on-wooden-table-side-view-of-taiwan-baked-food-photo.jpg',
      rating: 4.9,
      meta: 'Creamy classic'
    },
    {
      id: 4,
      name: 'Mocha',
      price: 40.75,
      category: 'coffee',
      description: 'Espresso blended with chocolate and steamed milk for a rich treat.',
      image: 'https://media.istockphoto.com/id/157675911/photo/cappuccino-topped-with-swirls-of-chocolate-sauce.jpg?s=612x612&w=0&k=20&c=606NMYMjVnTmpSnJI537_IjW3lqfNJaH7Lc9Qg0BXPU=',
      rating: 4.7,
      meta: 'Chocolatey'
    },
    // Food & Pastries
    {
      id: 5,
      name: 'Croissant',
      price: 20.50,
      category: 'food',
      description: 'Flaky, buttery pastry perfect with your morning brew.',
      image: 'https://img.freepik.com/free-photo/croissants-wooden-cutting-board_1150-28480.jpg?semt=ais_hybrid&w=740&q=80',
      rating: 4.8,
      meta: 'Buttery layers'
    },
    {
      id: 6,
      name: 'Muffin',
      price: 20.75,
      category: 'food',
      description: 'Soft and moist, available in a variety of flavors.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-HVuracEvP5iGSPPnsF69NRv32glS3eYWbQ&s',
      rating: 4.6,
      meta: 'Freshly baked'
    }
  ], []);

  useEffect(() => {
    setMenuItems(menuData);
    setFilteredItems(menuData);
  }, [menuData]);

  useEffect(() => {
    let filtered = menuItems;

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'bestseller') {
        filtered = filtered.filter(item => item.isBestSeller);
      } else {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [menuItems, selectedCategory, searchTerm]);

  // Initialize reveal animations for visible cards within this page
  useEffect(() => {
    const grids = [coffeeGridRef.current, foodGridRef.current].filter(Boolean);
    if (!grids.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    grids.forEach((grid) => {
      const revealEls = grid.querySelectorAll('.reveal');
      revealEls.forEach((el) => observer.observe(el));
    });

    return () => observer.disconnect();
  }, [filteredItems]);

  // Get items for each section
  const getCoffeeItems = () => {
    return filteredItems.filter(item => item.category === 'coffee');
  };

  const getFoodItems = () => {
    return filteredItems.filter(item => item.category === 'food');
  };

  // Check if sections should be visible
  const shouldShowCoffeeSection = () => {
    if (selectedCategory === 'food') return false;
    return getCoffeeItems().length > 0;
  };

  const shouldShowFoodSection = () => {
    if (selectedCategory === 'coffee') return false;
    return getFoodItems().length > 0;
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setOrderMessage('');

    try {
      const response = await axios.post('/api/index.php?route=order', {
        items: cart,
        customerName: customerName || 'Guest',
        customerEmail: customerEmail || null
      });

      if (response.data.success) {
        // Show toast and reset in-modal messages
        setOrderMessage('');
        setToast({ visible: true, message: 'Order placed successfully! Thank you for your order.', type: 'success' });
        // Auto hide after 3 seconds
        setTimeout(() => {
          setToast(prev => ({ ...prev, visible: false }));
        }, 3000);

        clearCart();
        setCustomerName('');
        setCustomerEmail('');
        setIsOrderModalOpen(false);
      } else {
        setOrderMessage(response.data.message || 'Order failed. Please try again.');
      }
    } catch (error) {
      setOrderMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hide empty cart warning once user adds any item
  useEffect(() => {
    if (cart.length > 0 && showEmptyCartWarning) {
      setShowEmptyCartWarning(false);
    }
  }, [cart.length, showEmptyCartWarning]);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <>
      {/* Toast Notification */}
      <div className={`toast ${toast.type} ${toast.visible ? 'show' : ''}`} role="status" aria-live="polite">
        {toast.message}
      </div>
      {/* Menu Intro */}
      <section className="menu-intro">
        <div className="container">
          <h1>Our Menu</h1>
          <p>Freshly brewed coffee and delightful treats</p>
          <div className="menu-toolbar">
            <label className="menu-search" aria-label="Search menu">
              <span className="icon">🔎</span>
              <input 
                id="menu-search-input" 
                type="search" 
                placeholder="Search items..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            <div className="chip-group" aria-label="Filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`chip ${selectedCategory === category ? 'active' : ''}`}
                  data-filter={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All' : 
                   category === 'bestseller' ? 'Best Sellers' :
                   category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coffee Section */}
      {shouldShowCoffeeSection() && (
        <section className="featured menu-first" data-section="coffee">
          <div className="container">
            <div className="section-head">
              <h2>☕ Coffee & Beverages</h2>
              <p>Expertly crafted coffee drinks made with premium beans</p>
            </div>
            <div className="menu-grid fixed-cards" ref={coffeeGridRef}>
              {getCoffeeItems().map((item) => {
                return (
                  <div key={item.id} className="card reveal" data-cat={item.isBestSeller ? `${item.category} bestseller` : item.category} data-name={item.name}>
                    {item.isBestSeller && <span className="badge">Best Seller</span>}
                    <img src={item.image} alt={item.name} />
                    <h3>{item.name}</h3>
                    <div className="meta">
                      <span className="stars">{'★'.repeat(Math.floor(item.rating))}{'☆'.repeat(5 - Math.floor(item.rating))}</span>
                      <span>{item.meta}</span>
                    </div>
                    <p className="desc">{item.description}</p>
                    <p className="price">₱{item.price.toFixed(2)}</p>
                    <div className="card-footer">
                      <button className="add-to-cart" onClick={() => addToCart(item.name, item.price)}>
                        Add to Order
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Food Section */}
      {shouldShowFoodSection() && (
        <section className="featured" data-section="food">
          <div className="container">
            <div className="section-head">
              <h2>🥐 Food & Pastries</h2>
              <p>Freshly baked treats and delicious snacks</p>
            </div>
            <div className="menu-grid fixed-cards" ref={foodGridRef}>
              {getFoodItems().map((item) => {
                return (
                  <div key={item.id} className="card reveal" data-cat={item.isBestSeller ? `${item.category} bestseller` : item.category} data-name={item.name}>
                    {item.isBestSeller && <span className="badge">Best Seller</span>}
                    <img src={item.image} alt={item.name} />
                    <h3>{item.name}</h3>
                    <div className="meta">
                      <span className="stars">{'★'.repeat(Math.floor(item.rating))}{'☆'.repeat(5 - Math.floor(item.rating))}</span>
                      <span>{item.meta}</span>
                    </div>
                    <p className="desc">{item.description}</p>
                    <p className="price">₱{item.price.toFixed(2)}</p>
                    <div className="card-footer">
                      <button className="add-to-cart" onClick={() => addToCart(item.name, item.price)}>
                        Add to Order
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Order Summary */}
      <section className="order-summary container">
        <h2>Your Order</h2>
        <ul id="order-items">
          {cart.map((item, index) => (
            <li key={index} className="order-item">
              <span className="item-name">{item.name}</span>
              <div className="qty-controls">
                <button 
                  className="qty-btn"
                  onClick={() => updateQuantity(index, -1)}
                >
                  −
                </button>
                <span className="qty-display">{item.quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => updateQuantity(index, 1)}
                >
                  +
                </button>
              </div>
              <span className="line-price">
                ₱{(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <p id="order-total">Total: ₱{getTotalPrice().toFixed(2)}</p>
        {showEmptyCartWarning && cart.length === 0 && (
          <div className="inline-alert error" role="alert" aria-live="polite">
            <span className="icon">⚠</span>
            <span>Your order is empty. Please add at least one item to continue.</span>
          </div>
        )}
        <button 
          id="orderbutton"
          onClick={() => { 
            if (cart.length === 0) { 
              setShowEmptyCartWarning(true); 
              return; 
            }
            setOrderMessage(''); 
            setIsOrderModalOpen(true); 
          }}
          aria-disabled={false}
          title={'Place Order'}
        >
          Place Order
        </button>
      </section>

      {/* Checkout Modal */}
      {isOrderModalOpen && (
        <div id="checkout-modal" className="modal open" aria-hidden="false" role="dialog" aria-labelledby="checkout-title">
          <div className="modal-backdrop" onClick={() => setIsOrderModalOpen(false)}></div>
          <div className="modal-dialog" role="document">
            <div className="modal-header">
              <h3 id="checkout-title">Checkout Details</h3>
              <button 
                className="modal-close" 
                aria-label="Close" 
                onClick={() => setIsOrderModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form id="checkout-form" onSubmit={handleOrderSubmit}>
              <div className="modal-body">
                <div className="field">
                  <label htmlFor="customer-name">Full Name</label>
                  <input 
                    type="text" 
                    id="customer-name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Juan Dela Cruz" 
                    required 
                  />
                </div>
                <div className="field">
                  <label htmlFor="customer-address">Address</label>
                  <textarea 
                    id="customer-address" 
                    rows="3" 
                    placeholder="House No., Street, Barangay, City" 
                    required
                  ></textarea>
                  <small className="hint">We use this to prepare your order for pickup/delivery.</small>
                </div>
                {orderMessage && (
                  <div className={`form-alert ${orderMessage.includes('successfully') ? 'success' : 'error'}`}>
                    {orderMessage}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => { setOrderMessage(''); setIsOrderModalOpen(false); }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuPage;
