import React, { useState, useEffect } from 'react';
import { 
  FaEye, FaCheck, FaTruck, FaBox, 
  FaFilter, FaSearch, FaDownload,
  FaWhatsapp, FaPhone, FaMapMarkerAlt,
  FaMoneyBillWave, FaClock, FaBan, FaTimes,
  FaExclamationTriangle
} from 'react-icons/fa';
import { motion } from 'framer-motion'; // ✅ ADD THIS IMPORT

const AdminOrders = ({ darkMode }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');
  
  // Modal states for confirmations
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    orderId: null,
    action: '',
    title: '',
    message: ''
  });

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        order.orderId?.toLowerCase().includes(searchLower) ||
        order.shippingAddress?.fullName?.toLowerCase().includes(searchLower) ||
        order.shippingAddress?.phone?.includes(search)
      );
    }
    return true;
  });

  // Open confirmation modal
const openConfirmModal = (orderId, action) => {
  let title = '';
  let message = '';
  
  switch(action) {
    case 'confirm':
      title = 'Confirm Order';
      message = 'Are you sure you want to confirm this order?';
      break;
    case 'ship':
      title = 'Mark as Shipped';
      message = 'Are you sure you want to mark this order as shipped?';
      break;
    case 'deliver':
      title = 'Mark as Delivered';
      message = 'Are you sure you want to mark this order as delivered?';
      break;
    case 'verify':
      title = 'Verify Payment';
      message = 'Have you confirmed the payment in EasyPaisa/JazzCash app?';
      break;
    // ✅ ADD THIS CASE
    case 'cancel':
      title = 'Cancel Order';
      message = 'Are you sure you want to cancel this order? This action cannot be undone.';
      break;
    default:
      title = 'Confirm Action';
      message = 'Are you sure you want to proceed?';
  }
  
  setConfirmModal({
    show: true,
    orderId,
    action,
    title,
    message
  });
};
  // Close confirmation modal
  const closeConfirmModal = () => {
    setConfirmModal({
      show: false,
      orderId: null,
      action: '',
      title: '',
      message: ''
    });
  };

  // Execute the action after confirmation
// Execute the action after confirmation
const executeAction = async () => {
  const { orderId, action } = confirmModal;
  
  try {
    if (action === 'verify') {
      // Handle payment verification
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { 
            ...order, 
            paymentStatus: 'verified',
            paymentVerifiedAt: new Date()
          } : order
        ));
        alert(`✅ Payment verified! Order ready to ship.`);
      }
    } 
    // ✅ ADD THIS CANCEL CASE
    else if (action === 'cancel') {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        ));
        alert(`✅ Order cancelled`);
      }
    }
    else {
      // Handle status updates (confirm, ship, deliver)
      let newStatus = '';
      switch(action) {
        case 'confirm': newStatus = 'confirmed'; break;
        case 'ship': newStatus = 'shipped'; break;
        case 'deliver': newStatus = 'delivered'; break;
        default: return;
      }
      
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        alert(`✅ Order marked as ${newStatus}`);
      }
    }
  } catch (error) {
    console.error('Error updating order:', error);
    alert('❌ Failed to update order');
  } finally {
    closeConfirmModal();
  }
};

  // Export orders to CSV
  const exportOrders = () => {
    const csvData = filteredOrders.map(order => ({
      'Order ID': order.orderId || order._id.slice(-8),
      'Customer': order.shippingAddress?.fullName,
      'Phone': order.shippingAddress?.phone,
      'City': order.shippingAddress?.city,
      'Amount': `Rs ${order.totalPrice?.toLocaleString()}`,
      'Payment': order.paymentMethod,
      'Payment Status': order.paymentStatus || 'pending',
      'Order Status': order.status,
      'Date': new Date(order.createdAt).toLocaleDateString(),
      'Items': order.orderItems?.length || 0
    }));
    
    if (csvData.length === 0) return;
    
    const csvHeaders = Object.keys(csvData[0]).join(',');
    const csvRows = csvData.map(row => Object.values(row).join(','));
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khokharmart_orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment status color
  const getPaymentColor = (paymentMethod, paymentStatus) => {
    if (paymentMethod === 'COD') return 'bg-gray-100 text-gray-800';
    if (paymentStatus === 'verified') return 'bg-green-100 text-green-800';
    if (paymentStatus === 'pending') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  // Format payment method name
  const formatPaymentMethod = (method) => {
    if (method === 'COD') return 'COD';
    if (method === 'EasyPaisa') return 'EasyPaisa';
    if (method === 'JazzCash') return 'JazzCash';
    return method;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
          Order Management
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage KhokharMart Aloe Vera orders and track deliveries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="text-2xl font-bold">{orders.length}</div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="text-2xl font-bold text-yellow-500">
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="text-2xl font-bold text-blue-500">
            {orders.filter(o => o.status === 'confirmed').length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confirmed</div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="text-2xl font-bold text-purple-500">
            {orders.filter(o => o.status === 'shipped').length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shipped</div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="text-2xl font-bold text-green-500">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Delivered</div>
        </div>
      </div>

      {/* Payment Verification Alert */}
      {orders.filter(o => 
        o.paymentMethod !== 'COD' && 
        o.paymentStatus === 'pending' && 
        o.status === 'pending'
      ).length > 0 && (
        <div className={`mb-6 p-4 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800`}>
          <div className="flex items-center gap-2">
            <FaClock className="text-yellow-600" />
            <span className="font-medium">
              {orders.filter(o => o.paymentMethod !== 'COD' && o.paymentStatus === 'pending').length} 
              {' '}orders pending payment verification
            </span>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, Phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-black placeholder-gray-500'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-black'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Export Button */}
          <div className="flex items-center gap-2">
            <button 
              onClick={exportOrders}
              disabled={filteredOrders.length === 0}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <FaDownload />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className={`rounded-lg overflow-hidden shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-900' : 'bg-gray-100'}>
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="text-4xl mb-2">🌿</div>
                    <div className="text-lg">No orders found</div>
                    <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {search ? 'Try different search terms' : 'Orders will appear here when customers place orders'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order._id} 
                    className={`border-t ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="p-3">
                      <div className="font-medium">{order.orderId || `ORD-${order._id.slice(-6)}`}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{order.shippingAddress?.fullName}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {order.shippingAddress?.phone}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {order.shippingAddress?.city}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-green-600">
                        Rs {order.totalPrice?.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                          order.paymentMethod === 'COD' 
                            ? 'bg-gray-100 text-gray-800'
                            : order.paymentMethod === 'EasyPaisa'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {formatPaymentMethod(order.paymentMethod)}
                        </span>
                        {order.paymentMethod !== 'COD' && (
                          <span className={`px-2 py-1 rounded-full text-xs ${getPaymentColor(order.paymentMethod, order.paymentStatus)}`}>
                            {order.paymentStatus === 'verified' ? '✓ Verified' : '⏳ Pending'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={`p-2 rounded ${
                            darkMode 
                              ? 'bg-gray-700 hover:bg-gray-600' 
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          title="View Details"
                        >
                          <FaEye />
                        </button>

                       {order.status === 'pending' && (
  <>
    <button
      onClick={() => openConfirmModal(order._id, 'confirm')}
      className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
      title="Confirm Order"
    >
      <FaCheck />
    </button>
    
    {/* ✅ NEW CANCEL BUTTON */}
    <button
      onClick={() => openConfirmModal(order._id, 'cancel')}
      className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
      title="Cancel Order"
    >
      <FaBan />
    </button>
    
    {order.paymentMethod !== 'COD' && order.paymentStatus !== 'verified' && (
      <button
        onClick={() => openConfirmModal(order._id, 'verify')}
        className="p-2 rounded bg-green-100 text-green-700 hover:bg-green-200"
        title="Verify Payment"
      >
        <FaMoneyBillWave />
      </button>
    )}
  </>
)}
                        
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => openConfirmModal(order._id, 'ship')}
                            className="p-2 rounded bg-purple-100 text-purple-700 hover:bg-purple-200"
                            title="Mark as Shipped"
                          >
                            <FaTruck />
                          </button>
                        )}
                        
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => openConfirmModal(order._id, 'deliver')}
                            className="p-2 rounded bg-green-100 text-green-700 hover:bg-green-200"
                            title="Mark as Delivered"
                          >
                            <FaBox />
                          </button>
                        )}

                        {/* Contact Actions */}
                        <a
                          href={`tel:${order.shippingAddress?.phone}`}
                          className={`p-2 rounded ${
                            darkMode 
                              ? 'bg-blue-900 text-blue-400 hover:bg-blue-800' 
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                          title="Call Customer"
                        >
                          <FaPhone />
                        </a>

                        <a
                          href={`https://wa.me/${order.shippingAddress?.phone?.replace('+', '')}?text=Hello! Regarding your KhokharMart order ${order.orderId || order._id.slice(-8)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 rounded ${
                            darkMode 
                              ? 'bg-green-900 text-green-400 hover:bg-green-800' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          title="WhatsApp Customer"
                        >
                          <FaWhatsapp />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-xl w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
          >
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                  <FaExclamationTriangle size={20} />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                  {confirmModal.title}
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {confirmModal.message}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={executeAction}
                  className="flex-1 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700"
                >
                  Yes, Proceed
                </button>
                <button
                  onClick={closeConfirmModal}
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  No, Go Back
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className={`rounded-xl w-full max-w-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                  Order Details: {selectedOrder.orderId || `ORD-${selectedOrder._id.slice(-6)}`}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className={`p-2 rounded-lg ${
                    darkMode 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Customer Info */}
              <div className="mb-6">
                <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name</div>
                    <div className="font-medium">{selectedOrder.shippingAddress?.fullName}</div>
                  </div>
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</div>
                    <div className="font-medium">{selectedOrder.shippingAddress?.phone}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Address</div>
                    <div className="font-medium">{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mb-6">
                <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Method</div>
                    <div className="font-medium">{formatPaymentMethod(selectedOrder.paymentMethod)}</div>
                  </div>
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedOrder.paymentMethod === 'COD' 
                        ? 'bg-gray-100 text-gray-800'
                        : selectedOrder.paymentStatus === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedOrder.paymentMethod === 'COD' 
                        ? 'Cash on Delivery' 
                        : selectedOrder.paymentStatus === 'verified' 
                        ? '✓ Verified' 
                        : '⏳ Pending Verification'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                  Order Items
                </h3>
                <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <table className="w-full">
                    <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                      <tr>
                        <th className="p-3 text-left">Product</th>
                        <th className="p-3 text-left">Price</th>
                        <th className="p-3 text-left">Qty</th>
                        <th className="p-3 text-left">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderItems?.map((item, index) => (
                        <tr key={index} className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                                <span className="text-xl">🌿</span>
                              </div>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                {item.size && (
                                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Size: {item.size}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">Rs {item.price?.toLocaleString()}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3 font-bold">
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>Rs {selectedOrder.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span className={selectedOrder.shippingPrice === 0 ? 'text-green-600 font-medium' : ''}>
                    {selectedOrder.shippingPrice === 0 ? 'FREE' : `Rs ${selectedOrder.shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span className="text-green-600">Rs {selectedOrder.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Close
                </button>
                <a
                  href={`https://wa.me/${selectedOrder.shippingAddress?.phone?.replace('+', '')}?text=Hello! Regarding your KhokharMart order ${selectedOrder.orderId || selectedOrder._id.slice(-8)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                >
                  <FaWhatsapp />
                  WhatsApp Customer
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;