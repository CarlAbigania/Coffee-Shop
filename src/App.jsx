import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import LocationsPage from './pages/LocationsPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('coffeeshop-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('coffeeshop-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, price) => {
    const existingItem = cart.find(product => product.name === item);
    if (existingItem) {
      setCart(cart.map(product => 
        product.name === item 
          ? { ...product, quantity: product.quantity + 1 }
          : product
      ));
    } else {
      setCart([...cart, { name: item, price: price, quantity: 1 }]);
    }
  };

  const updateQuantity = (index, change) => {
    const newCart = [...cart];
    newCart[index].quantity += change;
    
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <div className="App">
        <Navigation cart={cart} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/menu" 
              element={
                <MenuPage 
                  cart={cart} 
                  addToCart={addToCart} 
                  updateQuantity={updateQuantity}
                  clearCart={clearCart}
                />
              } 
            />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
