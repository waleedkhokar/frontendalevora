import React, { useState, useEffect, useRef } from 'react'; // Add useRef
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Sector
} from 'recharts';
import {
  FaRupeeSign, FaShoppingBag, FaUsers, FaStar,
  FaDownload, FaCalendarAlt, FaMapMarkerAlt,
  FaMobile, FaTruck, FaCheckCircle, FaClock,
  FaArrowUp, FaArrowDown, FaChartLine, FaCity,
  FaCreditCard, FaMoneyBillWave, FaLeaf, FaSync,
  FaPercentage, FaWallet, FaChartPie, FaBoxOpen
} from 'react-icons/fa';
import jsPDF from 'jspdf';          // ✅ Only once
import html2canvas from 'html2canvas'; // ✅ Only once

const exportAsPDF = async () => {
  const element = document.getElementById('analytics-dashboard');
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`khokharmart-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
};
const AdminAnalytics = ({ darkMode }) => {
  const [analytics, setAnalytics] = useState({
    revenue: { total: 0, today: 0, week: 0, month: 0 },
    orders: { total: 0, pending: 0, delivered: 0, cancelled: 0 },
    customers: { total: 0, new: 0, returning: 0 },
    products: { total: 0, lowStock: 0, outOfStock: 0 },
    payments: { cod: 0, easypaisa: 0, jazzcash: 0 },
    profit: {
      total: 0,
      today: 0,
      month: 0,
      margin: 0,
      costs: {
        shipping: 0,
        packaging: 0,
        platform: 0,
        marketing: 0
      }
    }
  });

  const [timeframe, setTimeframe] = useState('week');
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [profitData, setProfitData] = useState([]);
  const [costSettings, setCostSettings] = useState({
    shippingPerOrder: 150,
    packagingCost: 50,
    platformFee: 0.05, // 5%
    marketingCost: 0.10 // 10%
  });

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const ordersRes = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      
      const productsRes = await fetch('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const productsData = await productsRes.json();

      if (ordersData.success) {
        const orders = ordersData.data || [];
        const products = productsData.data || [];
        
        // Calculate revenue
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        const today = new Date().toDateString();
        const todayRevenue = orders
          .filter(o => new Date(o.createdAt).toDateString() === today)
          .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        // Payment method split
        const cod = orders.filter(o => o.paymentMethod === 'COD').length;
        const easypaisa = orders.filter(o => o.paymentMethod === 'EasyPaisa').length;
        const jazzcash = orders.filter(o => o.paymentMethod === 'JazzCash').length;

        // Customer analytics
        const uniqueCustomers = new Set(orders.map(o => o.shippingAddress?.phone)).size;
        const repeatCustomers = orders.reduce((acc, o) => {
          acc[o.shippingAddress?.phone] = (acc[o.shippingAddress?.phone] || 0) + 1;
          return acc;
        }, {});
        const returningCount = Object.values(repeatCustomers).filter(c => c > 1).length;

        // Calculate profit
        const totalOrders = orders.length;
        const totalShipping = totalOrders * costSettings.shippingPerOrder;
        const totalPackaging = totalOrders * costSettings.packagingCost;
        const platformFees = totalRevenue * costSettings.platformFee;
        const marketingCosts = totalRevenue * costSettings.marketingCost;
        const totalCosts = totalShipping + totalPackaging + platformFees + marketingCosts;
        const totalProfit = totalRevenue - totalCosts;
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        // Calculate today's profit
        const todayOrders = orders.filter(o => 
          new Date(o.createdAt).toDateString() === today
        );
        const todayShipping = todayOrders.length * costSettings.shippingPerOrder;
        const todayPackaging = todayOrders.length * costSettings.packagingCost;
        const todayFees = todayRevenue * costSettings.platformFee;
        const todayMarketing = todayRevenue * costSettings.marketingCost;
        const todayProfit = todayRevenue - (todayShipping + todayPackaging + todayFees + todayMarketing);

        setAnalytics({
          revenue: {
            total: totalRevenue,
            today: todayRevenue,
            week: calculatePeriodRevenue(orders, 7),
            month: calculatePeriodRevenue(orders, 30)
          },
          orders: {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length
          },
          customers: {
            total: uniqueCustomers,
            new: uniqueCustomers - returningCount,
            returning: returningCount
          },
          products: {
            total: products.length,
            lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
            outOfStock: products.filter(p => p.stock <= 0).length
          },
          payments: { cod, easypaisa, jazzcash },
          profit: {
            total: totalProfit,
            today: todayProfit,
            month: calculatePeriodProfit(orders, 30),
            margin: profitMargin,
            costs: {
              shipping: totalShipping,
              packaging: totalPackaging,
              platform: platformFees,
              marketing: marketingCosts
            }
          }
        });

        // Generate chart data
        setRevenueData(generateRevenueChartData(orders, timeframe));
        setCityData(generateCityData(orders));
        setProductData(generateTopProducts(products, orders));
        setCustomerGrowth(generateCustomerGrowthData(orders));
        setProfitData(generateProfitData(orders));
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePeriodRevenue = (orders, days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return orders
      .filter(o => new Date(o.createdAt) >= cutoff)
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  };

  const calculatePeriodProfit = (orders, days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const periodOrders = orders.filter(o => new Date(o.createdAt) >= cutoff);
    const periodRevenue = periodOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const periodCount = periodOrders.length;
    
    const costs = (periodCount * costSettings.shippingPerOrder) +
                  (periodCount * costSettings.packagingCost) +
                  (periodRevenue * costSettings.platformFee) +
                  (periodRevenue * costSettings.marketingCost);
    
    return periodRevenue - costs;
  };

  const generateRevenueChartData = (orders, period) => {
    const data = [];
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayOrders = orders.filter(o => 
        new Date(o.createdAt).toDateString() === date.toDateString()
      );
      
      const revenue = dayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const count = dayOrders.length;
      
      // Calculate profit for the day
      const costs = (count * costSettings.shippingPerOrder) +
                    (count * costSettings.packagingCost) +
                    (revenue * costSettings.platformFee) +
                    (revenue * costSettings.marketingCost);
      const profit = revenue - costs;
      
      data.push({
        date: dateStr,
        revenue,
        profit,
        orders: count,
        avgOrder: count > 0 ? Math.round(revenue / count) : 0
      });
    }
    return data;
  };

  const generateProfitData = (orders) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = months[date.getMonth()];
      
      const monthOrders = orders.filter(o => 
        new Date(o.createdAt).getMonth() === date.getMonth() &&
        new Date(o.createdAt).getFullYear() === date.getFullYear()
      );
      
      const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const monthCount = monthOrders.length;
      
      const costs = (monthCount * costSettings.shippingPerOrder) +
                    (monthCount * costSettings.packagingCost) +
                    (monthRevenue * costSettings.platformFee) +
                    (monthRevenue * costSettings.marketingCost);
      const profit = monthRevenue - costs;
      
      data.push({
        month: monthName,
        revenue: monthRevenue,
        profit: profit,
        margin: monthRevenue > 0 ? (profit / monthRevenue) * 100 : 0
      });
    }
    return data;
  };

  const generateCityData = (orders) => {
    const cityMap = new Map();
    orders.forEach(order => {
      const city = order.shippingAddress?.city || 'Unknown';
      cityMap.set(city, (cityMap.get(city) || 0) + 1);
    });
    
    return Array.from(cityMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const generateTopProducts = (products, orders) => {
    const productSales = new Map();
    
    orders.forEach(order => {
      order.orderItems?.forEach(item => {
        const productId = item.product?._id || item.product;
        productSales.set(productId, (productSales.get(productId) || 0) + item.quantity);
      });
    });

    return products
      .map(p => ({
        name: p.name.split('-')[0].trim(),
        sales: productSales.get(p._id) || 0,
        revenue: (productSales.get(p._id) || 0) * p.price,
        profit: (productSales.get(p._id) || 0) * p.price * 0.3, // 30% profit margin
        stock: p.stock
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  };

  const generateCustomerGrowthData = (orders) => {
    const monthlyData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = months[date.getMonth()];
      
      const monthOrders = orders.filter(o => 
        new Date(o.createdAt).getMonth() === date.getMonth() &&
        new Date(o.createdAt).getFullYear() === date.getFullYear()
      );
      
      const uniqueCustomers = new Set(monthOrders.map(o => o.shippingAddress?.phone)).size;
      
      monthlyData.push({
        month: monthName,
        customers: uniqueCustomers
      });
    }
    return monthlyData;
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill={fill}>
          {value} orders ({`${(percent * 100).toFixed(1)}%`})
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 14}
          fill={fill}
        />
      </g>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
            Business Analytics
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Complete overview of your KhokharMart performance
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-black'
            } focus:ring-2 focus:ring-green-500`}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
          </select>

          <button
            onClick={fetchAnalyticsData}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FaSync /> Refresh
  </button>
  
 

  <button onClick={() => window.print()} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2">
    <FaDownload /> 📄 PDF Report
  </button>
</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-500 rounded-lg">
              <FaRupeeSign className="text-white text-xl" />
            </div>
            <span className="text-sm text-green-500 flex items-center">
              <FaArrowUp /> +12%
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-4">PKR {analytics.revenue.total.toLocaleString()}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Revenue
          </p>
          <div className="flex justify-between mt-2 text-xs">
            <span>Today: PKR {analytics.revenue.today.toLocaleString()}</span>
            <span>Month: PKR {analytics.revenue.month.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Profit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-green-500`}
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-500 rounded-lg">
              <FaWallet className="text-white text-xl" />
            </div>
            <span className="text-sm text-emerald-500 flex items-center">
              <FaPercentage /> {analytics.profit.margin.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-4">PKR {analytics.profit.total.toLocaleString()}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Net Profit
          </p>
          <div className="flex justify-between mt-2 text-xs">
            <span>Today: PKR {analytics.profit.today.toLocaleString()}</span>
            <span>Month: PKR {analytics.profit.month.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Orders Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-500 rounded-lg">
              <FaShoppingBag className="text-white text-xl" />
            </div>
            <span className="text-sm text-blue-500">{analytics.orders.pending} pending</span>
          </div>
          <h3 className="text-2xl font-bold mt-4">{analytics.orders.total}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Orders
          </p>
          <div className="flex justify-between mt-2 text-xs">
            <span>Delivered: {analytics.orders.delivered}</span>
            <span>Cancelled: {analytics.orders.cancelled}</span>
          </div>
        </motion.div>

        {/* Customers Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-500 rounded-lg">
              <FaUsers className="text-white text-xl" />
            </div>
            <span className="text-sm text-purple-500">
              {analytics.customers.returning} returning
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-4">{analytics.customers.total}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Customers
          </p>
          <div className="flex justify-between mt-2 text-xs">
            <span>New: {analytics.customers.new}</span>
            <span>Repeat: {analytics.customers.returning}</span>
          </div>
        </motion.div>
      </div>

      {/* Profit Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shipping Costs</p>
          <p className="text-xl font-bold text-orange-500">PKR {analytics.profit.costs.shipping.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Packaging Costs</p>
          <p className="text-xl font-bold text-yellow-500">PKR {analytics.profit.costs.packaging.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Platform Fees</p>
          <p className="text-xl font-bold text-blue-500">PKR {analytics.profit.costs.platform.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Marketing Costs</p>
          <p className="text-xl font-bold text-purple-500">PKR {analytics.profit.costs.marketing.toLocaleString()}</p>
        </div>
      </div>

      {/* Revenue vs Profit Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
          Revenue vs Profit
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="month" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  color: darkMode ? '#FFFFFF' : '#000000'
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue (PKR)" />
              <Bar dataKey="profit" fill="#F59E0B" name="Profit (PKR)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
          Daily Performance
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="date" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  color: darkMode ? '#FFFFFF' : '#000000'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                fill="url(#revenueGradient)"
                name="Revenue (PKR)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#F59E0B"
                fill="url(#profitGradient)"
                name="Profit (PKR)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by City */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            Sales by City
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={cityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            Payment Methods
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'COD', value: analytics.payments.cod },
                { name: 'EasyPaisa', value: analytics.payments.easypaisa },
                { name: 'JazzCash', value: analytics.payments.jazzcash }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="name" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    color: darkMode ? '#FFFFFF' : '#000000'
                  }}
                />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            Top Selling Products
          </h2>
          <div className="space-y-4">
            {productData.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-green-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Stock: {product.stock} units
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{product.sales} sold</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Profit: PKR {product.profit.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Customer Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            Customer Growth
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="month" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    color: darkMode ? '#FFFFFF' : '#000000'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Cost Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
          Cost Settings
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Shipping per Order (PKR)
            </label>
            <input
              type="number"
              value={costSettings.shippingPerOrder}
              onChange={(e) => setCostSettings({
                ...costSettings,
                shippingPerOrder: parseInt(e.target.value) || 0
              })}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-black'
              } mt-1`}
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Packaging Cost (PKR)
            </label>
            <input
              type="number"
              value={costSettings.packagingCost}
              onChange={(e) => setCostSettings({
                ...costSettings,
                packagingCost: parseInt(e.target.value) || 0
              })}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-black'
              } mt-1`}
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Platform Fee (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={costSettings.platformFee * 100}
              onChange={(e) => setCostSettings({
                ...costSettings,
                platformFee: (parseFloat(e.target.value) || 0) / 100
              })}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-black'
              } mt-1`}
            />
          </div>
          <div>
            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Marketing Cost (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={costSettings.marketingCost * 100}
              onChange={(e) => setCostSettings({
                ...costSettings,
                marketingCost: (parseFloat(e.target.value) || 0) / 100
              })}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-black'
              } mt-1`}
            />
          </div>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Update Calculations
        </button>
      </motion.div>

      {/* Low Stock Alert */}
      {analytics.products.lowStock > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'
          } border`}
        >
          <div className="flex items-center gap-3">
            <div className="text-red-500 text-xl">⚠️</div>
            <div>
              <p className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                Low Stock Alert!
              </p>
              <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                {analytics.products.lowStock} products have less than 10 units remaining.
                {analytics.products.outOfStock > 0 && ` ${analytics.products.outOfStock} products are out of stock.`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary Stats */}
      <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">
            {((analytics.customers.returning / analytics.customers.total) * 100 || 0).toFixed(1)}%
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Repeat Rate
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">
            PKR {Math.round(analytics.revenue.total / (analytics.orders.total || 1)).toLocaleString()}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Avg Order Value
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">
            {Math.round(analytics.orders.total / (analytics.customers.total || 1) * 10) / 10}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Orders/Customer
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500">
            {analytics.orders.delivered}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Completed Orders
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-500">
            {analytics.profit.margin.toFixed(1)}%
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Profit Margin
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;