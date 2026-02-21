import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Product from './pages/Product';
import Contact from './pages/contact';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminLogin from './pages/AdminLogin';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminCustomers from './components/admin/AdminCustomers';
import AdminAnalytics from './components/admin/AdminAnalytics';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import Checkout from './pages/Checkout';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        {/* ✅ ADD TOASTER HERE */}
    
 <Toaster />
        <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home darkMode={darkMode} />} />
              <Route path="/products" element={<Products darkMode={darkMode} />} />
              <Route path="/product/:id" element={<Product darkMode={darkMode} />} />
              <Route path="/cart" element={<Cart darkMode={darkMode} />} />
              <Route path="/about" element={<About darkMode={darkMode} />} />
              <Route path="/checkout" element={<Checkout darkMode={darkMode} />} />
              <Route path="/contact" element={<Contact darkMode={darkMode} />} />
              <Route path="/my-orders" element={<MyOrders darkMode={darkMode} />} />
              <Route path="/order/:id" element={<OrderDetails darkMode={darkMode} />} />
              
              <Route path="/admin/login" element={<AdminLogin darkMode={darkMode} />} />
              
              <Route path="/admin" element={
                <ProtectedRoute darkMode={darkMode}>
                  <AdminLayout darkMode={darkMode} />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard darkMode={darkMode} />} />
                <Route path="products" element={<AdminProducts darkMode={darkMode} />} />
                <Route path="orders" element={<AdminOrders darkMode={darkMode} />} />
                <Route path="users" element={<AdminUsers darkMode={darkMode} />} />
                <Route path="customers" element={<AdminCustomers darkMode={darkMode} />} />
                <Route path="analytics" element={<AdminAnalytics darkMode={darkMode} />} />
              </Route>
              
              <Route path="*" element={
                <div className="container mx-auto px-4 py-16 text-center">
                  <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                    404 - Page Not Found
                  </h1>
                  <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    The page you are looking for doesn't exist.
                  </p>
                  <Link 
                    to="/" 
                    className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-yellow-600 text-black hover:bg-yellow-700' : 'bg-black text-white hover:bg-gray-800'} transition`}
                  >
                    Go Home
                  </Link>
                </div>
              } />
            </Routes>
          </main>
          <Footer darkMode={darkMode} />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;