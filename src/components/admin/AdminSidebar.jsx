import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, FaShoppingBag, FaBox, FaUsers, 
  FaSignOutAlt, FaHome, FaBars, FaTimes,
  FaChartBar, FaLeaf,
  FaChevronRight, FaChevronLeft
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
// Add this with your other imports at the top
import { FaChartLine } from 'react-icons/fa';

const AdminSidebar = ({ 
  darkMode, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0
  });

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(false);
        setIsMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch stats for badges
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        // Fetch products count
        const productsRes = await fetch('http://localhost:5000/api/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const productsData = await productsRes.json();
        
        // Fetch orders count
        const ordersRes = await fetch('http://localhost:5000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const ordersData = await ordersRes.json();

        setStats({
          products: productsData.data?.length || 0,
          orders: ordersData.data?.length || 0,
          customers: ordersData.data ? [...new Set(ordersData.data.map(o => o.shippingAddress?.phone))].length : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

 const menuItems = [
  { 
    name: 'Dashboard', 
    path: '/admin', 
    icon: <FaTachometerAlt />, 
    badge: null,
    color: 'text-green-500'
  },
  { 
    name: 'Products', 
    path: '/admin/products', 
    icon: <FaShoppingBag />, 
    badge: stats.products,
    color: 'text-green-600'
  },
  { 
    name: 'Orders', 
    path: '/admin/orders', 
    icon: <FaBox />, 
    badge: stats.orders,
    color: 'text-green-500'
  },
  { 
    name: 'Customers', 
    path: '/admin/customers', 
    icon: <FaUsers />, 
    badge: stats.customers,   // ✅ stats.customers (not customers.length)
    color: 'text-green-400'
  },
   { 
    name: 'Analytics', 
    path: '/admin/analytics', 
    icon: <FaChartLine />,  // Make sure to import FaChartLine
    badge: null,
    color: 'text-purple-500'
  },
];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <>
      {/* Floating Mobile Toggle Button */}
      {isMobile && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleSidebar}
          className={`fixed top-4 left-4 z-50 p-3 rounded-2xl shadow-2xl ${
            darkMode 
              ? 'bg-gray-900 text-green-400 hover:bg-gray-800' 
              : 'bg-white text-green-600 hover:bg-gray-50'
          } transition-all duration-300 hover:shadow-3xl`}
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </motion.button>
      )}

      {/* Desktop Collapse Toggle */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className={`fixed top-6 left-6 z-50 p-2 rounded-full ${
            darkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } transition-all duration-300 hover:scale-110 hidden lg:block`}
        >
          {collapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
        </button>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isMobile ? (isMobileMenuOpen ? 0 : -320) : 0,
          width: isMobile ? 320 : collapsed ? 80 : 288
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 ${
          darkMode 
            ? 'bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800' 
            : 'bg-gradient-to-b from-white to-gray-50 border-r border-gray-200'
        } shadow-2xl overflow-hidden`}
        style={{ 
          width: isMobile ? '320px' : collapsed ? '80px' : '288px'
        }}
      >
        {/* Logo Section */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3`}>
            <motion.div
              animate={{ scale: collapsed ? 1.2 : 1 }}
              className={`p-3 rounded-xl ${
                darkMode 
                  ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/20' 
                  : 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
              }`}
            >
              <FaLeaf className={`text-2xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </motion.div>
            
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                    KhokharMart
                  </h2>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Admin Panel
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Admin Info - Only show when not collapsed */}
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}
            >
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Logged in as
              </p>
              <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-black'}`}>
                {localStorage.getItem('adminEmail')?.split('@')[0] || 'Admin'}
              </p>
            </motion.div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  className={`flex items-center ${collapsed ? 'justify-center px-3' : 'justify-between px-4'} py-3 rounded-xl transition-all duration-300 group relative ${
                    isActive(item.path)
                      ? darkMode
                        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-400'
                        : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600'
                      : darkMode
                      ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100/80 hover:text-black'
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive(item.path) && (
                    <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r ${
                      darkMode ? 'bg-green-400' : 'bg-green-600'
                    }`} />
                  )}

                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${item.color} ${isActive(item.path) ? 'scale-110' : ''}`}>
                      {item.icon}
                    </span>
                    
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className={`font-medium truncate ${
                            isActive(item.path) ? (darkMode ? 'text-white' : 'text-black') : ''
                          }`}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Badge */}
                  {item.badge > 0 && !collapsed && (
                    <span className={`px-2 py-1 text-xs rounded-full min-w-[24px] text-center ${
                      darkMode 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-green-500/20 text-green-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="space-y-2">
            {/* Back to Store */}
            <Link
              to="/"
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
              className={`flex items-center ${collapsed ? 'justify-center px-3' : 'justify-start px-4'} py-3 rounded-xl transition ${
                darkMode 
                  ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-100/80 hover:text-black'
              }`}
            >
              <FaHome className="text-lg" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  className="ml-3 font-medium truncate"
                >
                  Back to Store
                </motion.span>
              )}
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-3' : 'justify-start px-4'} py-3 rounded-xl transition ${
                darkMode 
                  ? 'bg-gradient-to-r from-red-900/30 to-red-800/30 text-red-400 hover:from-red-900/50 hover:to-red-800/50 hover:text-white' 
                  : 'bg-gradient-to-r from-red-100/80 to-red-50/80 text-red-600 hover:from-red-200 hover:to-red-100 hover:text-red-800'
              }`}
            >
              <FaSignOutAlt className="text-lg" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  className="ml-3 font-medium truncate"
                >
                  Logout
                </motion.span>
              )}
            </button>
          </div>

          {/* Version Info - Only show when not collapsed */}
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
            >
              KhokharMart v1.0 • 100% Pure
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;