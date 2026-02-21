import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaShoppingCart, FaTrash, FaPlus, FaMinus, 
  FaArrowLeft, FaCreditCard, FaShippingFast, FaShieldAlt,
  FaHistory, FaBox
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = ({ darkMode }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  // Check if user has any orders (from localStorage)
  const hasRecentOrder = localStorage.getItem('lastOrder');

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  const handleQuantityChange = (productId, size, change) => {
    const item = cart.items.find(
      item => item._id === productId && item.size === size
    );
    
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity >= 1 && newQuantity <= 10) {
        updateQuantity(productId, size, newQuantity);
      }
    }
  };

  // Empty cart view with "View My Orders" button
  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className={`inline-flex p-6 rounded-full mb-6 ${
            darkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <FaShoppingCart className="text-4xl opacity-50" />
          </div>
          <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            Your Cart is Empty
          </h1>
          <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Looks like you haven't added any aloe vera gel to your cart yet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 transition`}
            >
              <FaArrowLeft />
              Shop Aloe Vera
            </Link>

            {/* ✅ NEW: View My Orders button - only if they have orders */}
            {hasRecentOrder && (
              <Link
                to="/my-orders"
                className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                } transition`}
              >
                <FaHistory />
                View My Orders
              </Link>
            )}
          </div>

          {/* ✅ NEW: Quick order lookup */}
          {!hasRecentOrder && (
            <div className="mt-8 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                <span className="font-bold">Already placed an order?</span> 
                <br />Use the order ID from your email to track it.
              </p>
              <Link
                to="/my-orders"
                className="inline-block mt-2 text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                Track Order →
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Orders Link */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
              Shopping Cart
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} • 100% Pure Aloe Vera
            </p>
          </div>
          
          {/* ✅ NEW: View Orders button when cart has items */}
          <Link
            to="/my-orders"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              darkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            } transition`}
          >
            <FaHistory />
            My Orders
            <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full ml-1">
              {hasRecentOrder ? '1' : '0'}
            </span>
          </Link>
        </div>

        {/* Clear Cart button */}
        <div className="flex justify-end mt-2">
          <button
            onClick={clearCart}
            className={`text-sm flex items-center gap-1 px-3 py-1 rounded ${
              darkMode 
                ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' 
                : 'text-red-600 hover:text-red-800 hover:bg-red-100'
            } transition`}
          >
            <FaTrash size={12} />
            Clear Cart
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="space-y-4">
            {cart.items.map((item, index) => (
              <motion.div
                key={`${item._id}-${item.size}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 md:p-6 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg border ${
                  darkMode ? 'border-gray-800' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="sm:w-24 md:w-32">
                    <div className={`aspect-square rounded-lg overflow-hidden ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center text-4xl bg-gray-100">
                              🌿
                            </div>
                          `;
                        }}
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>
                          {item.name}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.size && (
                            <span className={`px-3 py-1 text-xs rounded-full ${
                              item.size === '500ml' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.size} • {item.size === '500ml' ? 'Best Value' : 'Trial Size'}
                            </span>
                          )}
                        </div>

                        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Rs {item.price.toLocaleString()} per bottle
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center border rounded-lg ${
                            darkMode ? 'border-gray-700' : 'border-gray-300'
                          }`}>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.size, -1)}
                              className={`p-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className={`px-3 py-1 min-w-[40px] text-center ${darkMode ? 'text-white' : 'text-black'}`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.size, 1)}
                              disabled={item.quantity >= 10}
                              className={`p-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} ${
                                item.quantity >= 10 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                          
                          <div className={`text-lg font-bold ${darkMode ? 'text-green-500' : 'text-green-600'}`}>
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id, item.size)}
                        className={`p-2 rounded-lg self-start sm:self-center ${
                          darkMode 
                            ? 'text-red-400 hover:bg-red-900/30' 
                            : 'text-red-600 hover:bg-red-100'
                        } transition`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/products"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition`}
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>

            {/* ✅ NEW: View Orders link */}
            <Link
              to="/my-orders"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              } transition`}
            >
              <FaBox />
              View My Orders
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className={`sticky top-24 p-6 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg border ${
            darkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
                  Rs {cart.totalPrice.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Shipping</span>
                <span className={darkMode ? 'text-green-400' : 'text-green-600'}>
                  {cart.totalPrice >= 2000 ? 'FREE' : 'Rs 150'}
                </span>
              </div>
              
              <div className="border-t pt-3 mt-3 border-gray-700">
                <div className="flex justify-between">
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Total</span>
                  <span className={`text-2xl font-bold ${darkMode ? 'text-green-500' : 'text-green-600'}`}>
                    Rs {(cart.totalPrice + (cart.totalPrice >= 2000 ? 0 : 150)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mb-4 bg-green-600 text-white hover:bg-green-700 transition"
            >
              <FaCreditCard />
              Proceed to Checkout
            </button>

            <div className="flex justify-center gap-2 mb-4">
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">EasyPaisa</span>
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">JazzCash</span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">COD</span>
            </div>

            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="flex items-center gap-2 mb-2">
                <FaShippingFast />
                <span>Free shipping on orders above Rs 2,000</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt />
                <span>100% pure guarantee • Secure payment</span>
              </div>
            </div>

            {/* ✅ NEW: Recent order reminder */}
            {hasRecentOrder && (
              <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className={`text-xs text-center ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                  You have a recent order! 
                  <Link to="/my-orders" className="font-bold block mt-1 hover:underline">
                    View Order Status →
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;