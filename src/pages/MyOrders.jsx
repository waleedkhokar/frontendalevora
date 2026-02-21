import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaBox, FaClock, FaCheckCircle, FaTimesCircle,
  FaTruck, FaCalendarAlt, FaRupeeSign, FaEye
} from 'react-icons/fa';

const MyOrders = ({ darkMode }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const lastOrder = localStorage.getItem('lastOrder');
        if (lastOrder) {
            try {
                const parsed = JSON.parse(lastOrder);
                setOrders([parsed]);
            } catch (error) {
                console.error('Error parsing last order:', error);
            }
        }
        setLoading(false);
    }, []);

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-PK', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <div className="container mx-auto px-4 py-12 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="container mx-auto px-4 py-12 md:py-16">
                
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
                            My <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Orders</span>
                        </h1>
                        <p className="text-xl md:text-2xl opacity-80 mb-6">
                            Track and manage your KhokharMart orders
                        </p>
                        <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto">
                    
                    {orders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-12 rounded-2xl text-center ${
                                darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                            } border`}
                        >
                            <div className="text-6xl mb-6 opacity-50">📦</div>
                            <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
                            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                You haven't placed any orders with us yet.
                            </p>
                            <Link
                                to="/products"
                                className={`inline-block px-8 py-3 rounded-full font-bold ${
                                    darkMode 
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/40' 
                                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30'
                                } transition-all duration-300`}
                            >
                                🌿 Shop Aloe Vera
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-6 md:p-8 rounded-2xl ${
                                        darkMode 
                                            ? 'bg-gray-900/50 border-gray-800' 
                                            : 'bg-gray-50 border-gray-200'
                                    } border hover:shadow-xl transition-all duration-300`}
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                Order #{order.orderId?.slice(-8)}
                                            </h3>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    <FaCalendarAlt className="inline mr-1" />
                                                    {formatDate(order.timestamp)}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Total Amount
                                            </p>
                                            <p className={`text-2xl font-bold flex items-center gap-1 ${
                                                darkMode ? 'text-green-400' : 'text-green-600'
                                            }`}>
                                                <FaRupeeSign />
                                                {(order.total || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className={`mb-6 p-4 rounded-xl ${
                                        darkMode ? 'bg-black/30' : 'bg-white'
                                    }`}>
                                        <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                                            Items
                                        </h4>
                                        <div className="space-y-2">
                                            {(order.items || []).map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                        {item.name?.split('-')[0]} {item.size && `(${item.size})`} ×{item.quantity}
                                                    </span>
                                                    <span className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                        Rs {(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link
                                            to={`/order/${order.orderId}`}
                                            className={`flex-1 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                                                darkMode 
                                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
                                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                            } transition-all duration-300`}
                                        >
                                            <FaEye />
                                            View Details
                                        </Link>
                                        
                                        {order.status?.toLowerCase() !== 'cancelled' && (
                                            <Link
                                                to="/checkout"
                                                className="flex-1 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                                            >
                                                <FaTimesCircle />
                                                Cancel Order
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Back to Home Link */}
                    <div className="text-center mt-12">
                        <Link
                            to="/"
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border ${
                                darkMode 
                                    ? 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600' 
                                    : 'border-gray-300 text-gray-600 hover:text-black hover:border-gray-400'
                            } transition-all duration-300`}
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;