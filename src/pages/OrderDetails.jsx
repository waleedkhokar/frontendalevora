import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';  // ← ONE LINE
import { motion } from 'framer-motion';
import { 
  FaBox, FaClock, FaCheckCircle, FaTimesCircle,
  FaTruck, FaArrowLeft, FaPhone, FaMapMarkerAlt,
  FaUser, FaEnvelope, FaRupeeSign, FaCalendarAlt,
  FaShoppingBag, FaTrash
} from 'react-icons/fa';
const OrderDetails = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      // First check localStorage for recent order
      const lastOrder = localStorage.getItem('lastOrder');
      if (lastOrder) {
        const parsed = JSON.parse(lastOrder);
        if (parsed.orderId === id || parsed.orderId?.slice(-8) === id) {
          setOrder(parsed);
          setLoading(false);
          return;
        }
      }

      // If not in localStorage, fetch from API
      const response = await fetch(`http://localhost:5000/api/orders/${id}`);
      const result = await response.json();
      
      if (result.success) {
        setOrder(result.data);
      } else {
        alert('Order not found');
        navigate('/my-orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        setOrder({ ...order, status: 'cancelled' });
        alert('✅ Order cancelled successfully');
      } else {
        alert(result.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Error cancelling order');
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className={`inline-flex p-6 rounded-full mb-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <FaBox className={`text-4xl ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            Order Not Found
          </h2>
          <Link
            to="/my-orders"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${
              darkMode 
                ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                : 'bg-black text-white hover:bg-gray-800'
            } transition`}
          >
            <FaArrowLeft />
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-white'} py-8`}>
      <div className="container mx-auto px-4 max-w-2xl">
    

        {/* Main Order Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 md:p-8 rounded-2xl ${
            darkMode ? 'bg-gray-900' : 'bg-white'
          } shadow-xl border ${
            darkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
         {/* Header with Back Button */}
<div className="relative mb-8">
  {/* Back Button - Positioned at top left */}
  <div className="absolute top-0 left-0">
    <Link
      to="/my-orders"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
        darkMode 
          ? 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
      } transition-all duration-300`}
    >
      <FaArrowLeft />
      <span>Back to Orders</span>
    </Link>
  </div>

  {/* Centered Content */}
  <div className="text-center pt-16">
    <div className={`inline-flex p-4 rounded-full mb-4 ${
      darkMode ? 'bg-gray-800' : 'bg-gray-100'
    }`}>
      {order.status === 'cancelled' ? (
        <FaTimesCircle className={`text-4xl ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
      ) : (
        <FaCheckCircle className={`text-4xl ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
      )}
    </div>
    
    <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
      Order Details
    </h1>
    
    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      Order #{order.orderId || id?.slice(-8)}
    </p>
    
    <div className="flex items-center justify-center gap-2 mt-2">
      <FaCalendarAlt className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {formatDate(order.createdAt || order.timestamp)}
      </span>
    </div>
  </div>
</div>

          {/* Customer Info */}
          <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-3 mb-3">
              <FaUser className={darkMode ? 'text-yellow-500' : 'text-black'} />
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                {order.shippingAddress?.fullName || order.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhone className={darkMode ? 'text-yellow-500' : 'text-black'} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {order.shippingAddress?.phone || order.phone}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
              Order Items
            </h3>
            <div className="space-y-3">
              {(order.items || []).map((item, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-white'
                      } flex items-center justify-center text-3xl`}>
                        <img 
  src={item.image} 
  alt={item.name}
  className="w-12 h-12 rounded-lg object-cover"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'https://res.cloudinary.com/dhe9aiqc2/image/upload/v123/fallback.jpg';
  }}
/>
                      </div>
                      <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                          {item.name?.split('-')[0].trim()}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.size && `${item.size} • `}
                          Rs {item.price?.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${darkMode ? 'text-yellow-500' : 'text-black'}`}>
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                  Rs {(order.subtotal || order.totalPrice || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Delivery</span>
                <span className={(order.shipping === 0 || order.shippingPrice === 0) ? 'text-green-500' : ''}>
                  {(order.shipping === 0 || order.shippingPrice === 0) ? 'FREE' : `Rs ${order.shipping || order.shippingPrice}`}
                </span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className={darkMode ? 'text-white' : 'text-black'}>Total</span>
                  <span className={`${darkMode ? 'text-yellow-500' : 'text-black'}`}>
                    Rs {(order.total || order.totalPrice || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel Order Button - Links to Checkout */}
          {order.status?.toLowerCase() === 'pending' && (
            <div className="mb-4">
              <Link
                to="/checkout"
                className={`w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                  darkMode 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                } transition-all duration-300`}
              >
                <FaTimesCircle />
                Cancel Your Order
              </Link>
              <p className={`text-xs mt-2 flex items-center justify-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <FaClock /> Click to go to checkout page
              </p>
            </div>
          )}

          {/* Cancelled Message */}
          {order.status?.toLowerCase() === 'cancelled' && (
            <div className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-center ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                This order has been cancelled.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/products"
              className={`flex-1 px-6 py-3 rounded-lg font-semibold text-center ${
                darkMode 
                  ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                  : 'bg-black text-white hover:bg-gray-800'
              } transition-all duration-300`}
            >
              Continue Shopping
            </Link>
            <Link
              to="/my-orders"
              className={`flex-1 px-6 py-3 rounded-lg font-semibold text-center ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              } transition-all duration-300`}
            >
              My Orders
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;