// src/components/common/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';

const Header = ({ darkMode, setDarkMode }) => {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // ✅ ADD THIS FUNCTION
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path.includes('products') && location.pathname.includes('products')) {
            const param = path.split('=')[1];
            const currentParam = location.search.split('=')[1];
            return param === currentParam;
        }
        return location.pathname === path;
    };

    // ✅ FIX GIRLS LINK (change 'women' to 'girls')
const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Aloe Vera', path: '/products' },  // No category filter
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
]
    // ... rest of your 300+ lines of code ...

    return (
        <>
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled 
                        ? darkMode 
                            ? 'bg-black/95 backdrop-blur-xl shadow-lg' 
                            : 'bg-white/95 backdrop-blur-xl shadow-lg'
                        : 'bg-transparent'
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                    

<Link to="/" className="flex items-center gap-3 z-50">
  <motion.div
    whileHover={{ rotate: 8, scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="relative"
  >
    <img
      src={logo}
      alt="JAVASCRIPT Logo"
      className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
    />
  </motion.div>

  <div className="leading-tight">
    <h1 className="text-lg sm:text-xl font-black tracking-tight">
       KHOKHARMART
    </h1>
    <p className="text-xs opacity-60 hidden sm:block">
      Natural Skincare
    </p>
  </div>
</Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`relative text-sm font-medium transition-all duration-200 ${
                                        location.pathname === item.path
                                            ? darkMode ? 'text-yellow-500' : 'text-black'
                                            : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                                    }`}
                                >
                                    {item.name}
                                    {location.pathname === item.path && (
                                        <motion.div
                                            layoutId="desktop-underline"
                                            className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                                                darkMode ? 'bg-yellow-500' : 'bg-black'
                                            }`}
                                        />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Side - ALWAYS SHOW Theme & Cart */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Theme Toggle - ALWAYS VISIBLE */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`relative w-12 h-6 rounded-full flex items-center transition-all ${
                                    darkMode 
                                        ? 'bg-gray-800 justify-end' 
                                        : 'bg-gray-300 justify-start'
                                }`}
                            >
                                <motion.div
                                    layout
                                    className={`w-5 h-5 rounded-full m-0.5 flex items-center justify-center ${
                                        darkMode ? 'bg-yellow-500' : 'bg-white'
                                    }`}
                                >
                                    {darkMode ? '🌙' : '☀️'}
                                </motion.div>
                            </button>
                            
                            {/* Cart - ALWAYS VISIBLE */}
                            <Link 
                                to="/cart" 
                                className={`p-2 rounded-lg relative ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                            >
                                🛒
                                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                                    darkMode ? 'bg-yellow-500 text-black' : 'bg-black text-white'
                                }`}>
                                    0
                                </span>
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 rounded-lg focus:outline-none"
                                aria-label="Menu"
                            >
                                <div className="w-6 h-6 relative">
                                    <motion.span
                                        animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                        className={`absolute left-0 w-6 h-0.5 rounded-full transition-all ${
                                            darkMode ? 'bg-gray-300' : 'bg-gray-700'
                                        }`}
                                    />
                                    <motion.span
                                        animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                        className={`absolute left-0 top-2 w-6 h-0.5 rounded-full transition-all ${
                                            darkMode ? 'bg-gray-300' : 'bg-gray-700'
                                        }`}
                                    />
                                    <motion.span
                                        animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                        className={`absolute left-0 top-4 w-6 h-0.5 rounded-full transition-all ${
                                            darkMode ? 'bg-gray-300' : 'bg-gray-700'
                                        }`}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay & Sidebar - FAST ANIMATION */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Sidebar - FAST SLIDE */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={`fixed top-0 right-0 bottom-0 w-80 max-w-full z-40 lg:hidden ${
                                darkMode ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-white to-gray-50'
                            } shadow-2xl`}
                        >
                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-800/30">
                                <div className="flex items-center gap-3">
                                   
                                    <div>
                                        <h2 className="font-black">KHOKHARMART</h2>
                                        <p className="text-xs opacity-60">Natural Skincare</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Navigation */}
                            <nav className="p-6">
                                <ul className="space-y-4">
                                    {navItems.map((item, index) => (
                                        <motion.li
                                            key={item.name}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.05, duration: 0.2 }}
                                        >
                                            <Link
                                                to={item.path}
                                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                                    location.pathname === item.path
                                                        ? darkMode 
                                                            ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' 
                                                            : 'bg-black/10 text-black border border-black/20'
                                                        : darkMode 
                                                            ? 'hover:bg-gray-800/50 text-gray-300' 
                                                            : 'hover:bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <span className="text-lg">
                                                    {item.name === 'Home' && '🏠'}
{item.name === 'Aloe Vera' && '🌿'}  
{item.name === 'About' && 'ℹ️'}
{item.name === 'Contact' && '📞'}
                                                </span>
                                                <span className="font-medium">{item.name}</span>
                                                {location.pathname === item.path && (
                                                    <span className="ml-auto">→</span>
                                                )}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* Mobile Cart in Sidebar */}
                                <Link
                                    to="/cart"
                                    className="flex items-center justify-between p-4 mt-8 rounded-xl border border-gray-800/30 hover:bg-gray-800/30 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">🛒</span>
                                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                            Shopping Cart
                                        </span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        darkMode ? 'bg-yellow-500 text-black' : 'bg-black text-white'
                                    }`}>
                                        0 items
                                    </span>
                                </Link>
                            </nav>

                            {/* Footer */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800/30">
                                <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              From the Himalayan Foothills • Cold-Pressed • 100% Pure •  Organic Aloe Vera • No Additives
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;