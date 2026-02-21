import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaUser, FaCreditCard, FaArrowLeft, FaMoneyBillWave,
  FaTimesCircle, FaClock
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Checkout = ({ darkMode }) => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cod'
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderSubtotal, setOrderSubtotal] = useState(0);
  const [orderShipping, setOrderShipping] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Load saved order from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      const parsed = JSON.parse(savedOrder);
      const orderTime = new Date(parsed.timestamp);
      const now = new Date();
      const hoursDiff = (now - orderTime) / (1000 * 60 * 60);
      
      // Only show if less than 1 hour old
      if (hoursDiff < 1) {
        setOrderPlaced(true);
        setOrderId(parsed.orderId);
        setOrderTotal(parsed.total);
        setOrderSubtotal(parsed.subtotal);
        setOrderShipping(parsed.shipping);
        setOrderData(parsed);
      } else {
        // Clear old order
        localStorage.removeItem('lastOrder');
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const shippingCost = formData.paymentMethod !== 'cod' ? 0 : (cart.totalPrice >= 2000 ? 0 : 250);
      const total = cart.totalPrice + shippingCost;

      const orderDataToSend = {
        items: cart.items.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || '',
          size: item.size
        })),
        shippingAddress: {
          fullName: formData.name,
          address: formData.address,
          city: formData.city,
          phone: formData.phone,
          email: formData.email || '',
          postalCode: '44000',
          country: 'Pakistan'
        },
        paymentMethod: formData.paymentMethod === 'cod' ? 'COD' : 
                       formData.paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash',
        totalPrice: total,
        shippingPrice: shippingCost
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDataToSend)
      });

      const result = await response.json();

      if (result.success) {
        const orderInfo = {
          orderId: result.data._id,
          subtotal: cart.totalPrice,
          shipping: shippingCost,
          total: total,
          name: formData.name,
          phone: formData.phone,
          timestamp: new Date().toISOString(),
          items: cart.items
        };
        
        localStorage.setItem('lastOrder', JSON.stringify(orderInfo));
        
        setOrderId(result.data._id);
        setOrderSubtotal(cart.totalPrice);
        setOrderShipping(shippingCost);
        setOrderTotal(total);
        setOrderData(orderInfo);
        setOrderPlaced(true);
        clearCart();
      } else {
        alert(result.message || 'Order failed');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

const handleCancelOrder = async () => {
  if (!orderId) return;
  
  if (!window.confirm('Are you sure you want to cancel this order?')) {
    return;
  }
  
  setCancelLoading(true);
  
  try {
    const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const result = await response.json();
    
    if (result.success) {
      // ✅ REPLACE alert WITH toast
      toast.success('✅ Order cancelled successfully!');
      
      localStorage.removeItem('lastOrder');
      setOrderPlaced(false);
      navigate('/products');
    } else {
      // ✅ SHOW backend error message in toast
      toast.error(result.message || '❌ Failed to cancel order');
    }
  } catch (error) {
    console.error('Cancel error:', error);
    // ✅ SHOW error toast
    toast.error('❌ Network error. Please try again.');
  } finally {
    setCancelLoading(false);
  }
};

  // Empty cart view
  if (cart.items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🌿</div>
        <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
          Your Cart is Empty
        </h1>
        <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Add some aloe vera gel to your cart before checking out.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-3 rounded-lg flex items-center gap-2 mx-auto bg-green-600 text-white hover:bg-green-700 transition"
        >
          <FaArrowLeft />
          Shop Aloe Vera
        </button>
      </div>
    );
  }

  // Success view with Cancel button
  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`max-w-2xl mx-auto p-8 rounded-2xl text-center ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl`}
        >
          <div className={`inline-flex p-4 rounded-full mb-6 ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          
          <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            Order Placed Successfully! 🎉
          </h1>
          
          <p className={`text-lg mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Thank you for your order, <span className="font-bold text-green-500">{formData.name || orderData?.name}</span>!
          </p>
          
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your order <span className="font-bold text-green-500">{orderId?.slice(-8)}</span> has been confirmed.
          </p>
          
          <div className={`p-6 rounded-xl mb-8 text-left ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
              Order Details
            </h3>
            
            {/* Items Summary */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              {(orderData?.items || cart.items).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name.split('-')[0].trim()} 
                    {item.size && <span className="text-xs ml-1">({item.size})</span>}
                    <span className="ml-1 text-gray-500">×{item.quantity}</span>
                  </span>
                  <span>Rs {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                <span>Rs {orderSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Delivery Charges</span>
                <span className={orderShipping === 0 ? 'text-green-500 font-medium' : ''}>
                  {orderShipping === 0 ? 'FREE' : `Rs ${orderShipping}`}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total Amount</span>
                <span className="text-green-600">Rs {orderTotal.toLocaleString()}</span>
              </div>
              {orderShipping === 0 && (
                <p className="text-xs text-green-500 mt-1">✓ Free shipping applied</p>
              )}
            </div>
          </div>
          
          {/* Cancel Order Button - Shows for 1 hour */}
          <div className="mb-4">
            <button
              onClick={handleCancelOrder}
              disabled={cancelLoading}
              className={`w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                cancelLoading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              } transition`}
            >
              {cancelLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Cancelling...
                </>
              ) : (
                <>
                  <FaTimesCircle />
                  Cancel Order
                </>
              )}
            </button>
            <p className={`text-xs mt-2 flex items-center justify-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              <FaClock /> You can cancel within 1 hour of placing order
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/')}
              className={`px-6 py-3 rounded-lg border ${
                darkMode 
                  ? 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-black'
              } transition`}
            >
              Go to Homepage
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Checkout form (rest of your code remains exactly the same)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-3xl md:text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-black'}`}>
        Checkout
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Order Form */}
        <div className="lg:w-2/3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg mb-6`}
          >
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-black'}`}>
              <FaUser />
              Shipping Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-black'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Waleed Khokhar"
                />
              </div>
              
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3">
                    <FaPhone className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-black'
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    placeholder="03XX XXXXXXX"
                  />
                </div>
              </div>
              
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-black'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Islamabad"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Delivery Address *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3">
                    <FaMapMarkerAlt className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-black'
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none`}
                    placeholder="House #123, Street #4, Sector F-10, Islamabad"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Email Address (optional)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3">
                    <FaEnvelope className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-black'
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    placeholder="waleed@example.com"
                  />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}
          >
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-black'}`}>
              <FaCreditCard />
              Payment Method
            </h2>
            
            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label className={`flex items-center p-4 rounded-lg border cursor-pointer ${
                formData.paymentMethod === 'cod'
                  ? 'border-green-500 bg-green-500/10'
                  : darkMode 
                  ? 'border-gray-700 hover:border-green-500' 
                  : 'border-gray-300 hover:border-green-500'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  className="mr-3 accent-green-500"
                />
                <div className="flex-1">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                    Cash on Delivery
                  </span>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Pay when you receive your order
                  </p>
                </div>
                <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <FaMoneyBillWave className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                </div>
              </label>
              
              {/* EasyPaisa */}
              <label className={`flex items-center p-4 rounded-lg border cursor-pointer ${
                formData.paymentMethod === 'easypaisa'
                  ? 'border-green-500 bg-green-500/10'
                  : darkMode 
                  ? 'border-gray-700 hover:border-green-500' 
                  : 'border-gray-300 hover:border-green-500'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="easypaisa"
                  checked={formData.paymentMethod === 'easypaisa'}
                  onChange={handleInputChange}
                  className="mr-3 accent-green-500"
                />
                <div className="flex-1">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                    EasyPaisa
                  </span>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Pay via EasyPaisa mobile account
                  </p>
                </div>
                <div className="p-2 rounded bg-green-100">
                  <span className="text-xs font-bold text-green-800">EasyPaisa</span>
                </div>
              </label>
              
              {/* JazzCash */}
              <label className={`flex items-center p-4 rounded-lg border cursor-pointer ${
                formData.paymentMethod === 'jazzcash'
                  ? 'border-green-500 bg-green-500/10'
                  : darkMode 
                  ? 'border-gray-700 hover:border-green-500' 
                  : 'border-gray-300 hover:border-green-500'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="jazzcash"
                  checked={formData.paymentMethod === 'jazzcash'}
                  onChange={handleInputChange}
                  className="mr-3 accent-green-500"
                />
                <div className="flex-1">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                    JazzCash
                  </span>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Pay via JazzCash mobile account
                  </p>
                </div>
                <div className="p-2 rounded bg-red-100">
                  <span className="text-xs font-bold text-red-800">JazzCash</span>
                </div>
              </label>
            </div>
            
            {/* Payment Instructions */}
            {formData.paymentMethod !== 'cod' && (
              <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className="text-sm font-medium mb-1">📱 Payment Instructions:</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  1. Open {formData.paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} app<br />
                  2. Send amount to <span className="font-bold text-green-500">+92 319 1402404</span><br />
                  3. Add order number in description<br />
                  4. We'll verify within 2 hours
                </p>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Right Column - Order Summary */}
        <div className="lg:w-1/3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`sticky top-24 p-6 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}
          >
            <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
              Order Summary
            </h2>
            
            {/* Items List */}
            <div className="mb-6 max-h-60 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={`${item._id}-${item.size}`} className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-700">
                  <div className="w-16 h-16 rounded overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl">🌿</div>';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-black'}`}>
                      {item.name.split('-')[0].trim()}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.quantity} × Rs {item.price.toLocaleString()}
                      </span>
                      {item.size && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          item.size === '500ml' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.size}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`font-semibold ${darkMode ? 'text-green-500' : 'text-green-600'}`}>
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                <span className="font-medium">Rs {cart.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Delivery Charges</span>
                <span className={
                  formData.paymentMethod !== 'cod' 
                    ? 'text-green-500 font-medium' 
                    : cart.totalPrice >= 2000 
                      ? 'text-green-500 font-medium' 
                      : ''
                }>
                  {formData.paymentMethod !== 'cod' ? 'FREE' : (cart.totalPrice >= 2000 ? 'FREE' : 'Rs 250')}
                </span>
              </div>
              <div className="border-t pt-3 border-gray-700">
                <div className="flex justify-between">
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Total</span>
                  <span className={`text-2xl font-bold ${darkMode ? 'text-green-500' : 'text-green-600'}`}>
                    Rs {(cart.totalPrice + (formData.paymentMethod !== 'cod' ? 0 : (cart.totalPrice >= 2000 ? 0 : 250))).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.paymentMethod === 'cod' 
                    ? 'Free shipping on orders above Rs 2,000' 
                    : '✓ Free shipping for digital payments'}
                </p>
              </div>
            </div>
            
            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              } transition shadow-lg hover:shadow-xl`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Place Order
                </>
              )}
            </button>
            
            <p className={`text-xs text-center mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              By placing your order, you agree to our Terms & Conditions
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;