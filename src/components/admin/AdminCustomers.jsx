import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaShoppingBag, FaRupeeSign, FaWhatsapp, FaDownload,
  FaSearch, FaFilter, FaStar, FaUserPlus, FaCalendarAlt,
  FaChartLine, FaCity, FaTrophy
} from 'react-icons/fa';

const AdminCustomers = ({ darkMode }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('spent'); // spent, orders, recent

  // Fetch customers from orders
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Get all orders
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        // Process orders to extract unique customers
        const orders = result.data || [];
        
        // Group by phone number (unique customer identifier)
        const customerMap = new Map();
        
        orders.forEach(order => {
          const customer = order.shippingAddress;
          if (!customer || !customer.phone) return;
          
          const key = customer.phone;
          
          if (!customerMap.has(key)) {
            customerMap.set(key, {
              id: key,
              name: customer.fullName || 'Unknown',
              phone: customer.phone,
              email: customer.email || 'No email',
              city: customer.city || 'Unknown',
              orders: [],
              totalSpent: 0,
              firstOrder: order.createdAt,
              lastOrder: order.createdAt
            });
          }
          
          const customerData = customerMap.get(key);
          customerData.orders.push(order);
          customerData.totalSpent += order.totalPrice || 0;
          
          // Update dates
          if (new Date(order.createdAt) < new Date(customerData.firstOrder)) {
            customerData.firstOrder = order.createdAt;
          }
          if (new Date(order.createdAt) > new Date(customerData.lastOrder)) {
            customerData.lastOrder = order.createdAt;
          }
        });
        
        // Convert map to array and sort by total spent
        const customerArray = Array.from(customerMap.values())
          .map(cust => ({
            ...cust,
            orderCount: cust.orders.length,
            isRepeat: cust.orders.length > 1,
            averageOrderValue: Math.round(cust.totalSpent / cust.orders.length)
          }));
        
        setCustomers(customerArray);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique cities for filter
  const cities = ['all', ...new Set(customers.map(c => c.city).filter(Boolean))];

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      // Search filter
      const matchesSearch = search === '' || 
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search) ||
        customer.email.toLowerCase().includes(search.toLowerCase());
      
      // City filter
      const matchesCity = cityFilter === 'all' || customer.city === cityFilter;
      
      return matchesSearch && matchesCity;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'spent':
          return b.totalSpent - a.totalSpent;
        case 'orders':
          return b.orderCount - a.orderCount;
        case 'recent':
          return new Date(b.lastOrder) - new Date(a.lastOrder);
        default:
          return 0;
      }
    });

  // Export to CSV
  const exportCustomers = () => {
    const csvData = filteredCustomers.map(c => ({
      Name: c.name,
      Phone: c.phone,
      Email: c.email,
      City: c.city,
      'Total Orders': c.orderCount,
      'Total Spent': `Rs ${c.totalSpent.toLocaleString()}`,
      'Avg Order': `Rs ${c.averageOrderValue.toLocaleString()}`,
      'First Order': new Date(c.firstOrder).toLocaleDateString(),
      'Last Order': new Date(c.lastOrder).toLocaleDateString(),
      'Customer Type': c.isRepeat ? 'Repeat' : 'One-time'
    }));

    const csvHeaders = Object.keys(csvData[0]).join(',');
    const csvRows = csvData.map(row => Object.values(row).join(','));
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khokharmart_customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Calculate statistics
  const totalCustomers = customers.length;
  const repeatCustomers = customers.filter(c => c.isRepeat).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrderValue = customers.length > 0 
    ? Math.round(totalRevenue / customers.reduce((sum, c) => sum + c.orderCount, 0))
    : 0;

  // City-wise distribution
  const cityStats = customers.reduce((acc, c) => {
    acc[c.city] = (acc[c.city] || 0) + 1;
    return acc;
  }, {});

  const topCities = Object.entries(cityStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

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
          Customer Management
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          View and manage all customers who have ordered from KhokharMart
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <FaUsers className="text-2xl text-blue-500" />
            <span className="text-sm text-green-500">+{repeatCustomers} repeat</span>
          </div>
          <h3 className="text-2xl font-bold">{totalCustomers}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Customers
          </p>
        </div>

        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
           <span className="text-2xl text-green-500 font-bold">Rs</span>
            <span className="text-sm text-blue-500">Avg: Rs {averageOrderValue}</span>
          </div>
          <h3 className="text-2xl font-bold">Rs {totalRevenue.toLocaleString()}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Revenue
          </p>
        </div>

        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <FaStar className="text-2xl text-yellow-500" />
            <span className="text-sm text-purple-500">{repeatCustomers} regulars</span>
          </div>
          <h3 className="text-2xl font-bold">
            {totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0}%
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Repeat Customer Rate
          </p>
        </div>

        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <FaCity className="text-2xl text-purple-500" />
            <span className="text-sm text-orange-500">{Object.keys(cityStats).length} cities</span>
          </div>
          <h3 className="text-2xl font-bold">{topCities[0]?.[0] || 'N/A'}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Top City
          </p>
        </div>
      </div>

      {/* City Distribution */}
      <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-2 mb-3">
          <FaChartLine className="text-green-500" />
          <h3 className="font-semibold">Top Cities</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {topCities.map(([city, count]) => (
            <div key={city} className="text-center">
              <div className="font-bold">{city}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {count} customer{count !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-black'
              } focus:ring-2 focus:ring-green-500`}
            />
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-black'
              } focus:ring-2 focus:ring-green-500`}
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city === 'all' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-black'
            } focus:ring-2 focus:ring-green-500`}
          >
            <option value="spent">Sort by: Total Spent</option>
            <option value="orders">Sort by: Orders Count</option>
            <option value="recent">Sort by: Most Recent</option>
          </select>

          {/* Export */}
          <button
            onClick={exportCustomers}
            disabled={filteredCustomers.length === 0}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 disabled:opacity-50' 
                : 'bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
            }`}
          >
            <FaDownload />
            Export CSV
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className={`rounded-xl overflow-hidden shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-900' : 'bg-gray-100'}>
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Orders</th>
                <th className="p-4 text-left">Total Spent</th>
                <th className="p-4 text-left">Last Order</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center">
                    <FaUsers className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>No customers found</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-t ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="p-4">
                      <div className="font-medium">{customer.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-sm hover:text-green-500">
                          <FaPhone size={12} />
                          {customer.phone}
                        </a>
                        {customer.email !== 'No email' && (
                          <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-sm hover:text-green-500">
                            <FaEnvelope size={12} />
                            <span className="truncate max-w-[150px]">{customer.email}</span>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        {customer.city}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center">
                        <div className="font-bold text-xl">{customer.orderCount}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          orders
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-green-600">
                        Rs {customer.totalSpent.toLocaleString()}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Avg: Rs {customer.averageOrderValue}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <div>
                          <div className="text-sm">{new Date(customer.lastOrder).toLocaleDateString()}</div>
                          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {new Date(customer.lastOrder).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {customer.isRepeat ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <FaTrophy className="inline mr-1" />
                          Repeat
                        </span>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                          One-time
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <a
                          href={`tel:${customer.phone}`}
                          className={`p-2 rounded-lg ${
                            darkMode 
                              ? 'bg-blue-900 text-blue-400 hover:bg-blue-800' 
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                          title="Call Customer"
                        >
                          <FaPhone />
                        </a>
                        <a
                          href={`https://wa.me/${customer.phone.replace('+', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 rounded-lg ${
                            darkMode 
                              ? 'bg-green-900 text-green-400 hover:bg-green-800' 
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          title="WhatsApp Customer"
                        >
                          <FaWhatsapp />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      {filteredCustomers.length > 0 && (
        <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="flex justify-between items-center">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Showing {filteredCustomers.length} of {customers.length} customers
            </span>
            <div className="flex gap-4">
              <span className="text-sm">
                <span className="font-bold">{repeatCustomers}</span> repeat customers
              </span>
              <span className="text-sm">
                <span className="font-bold">{totalCustomers - repeatCustomers}</span> one-time
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;