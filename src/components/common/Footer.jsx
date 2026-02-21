import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FaFacebook, FaInstagram, FaWhatsapp, FaTiktok,
    FaMapMarkerAlt, FaPhone, FaEnvelope, FaTruck, FaShieldAlt,
    FaUndo, FaCreditCard, FaMoneyBillWave
} from 'react-icons/fa';

const Footer = ({ darkMode = true }) => {
    const currentYear = new Date().getFullYear();

    // Social links - ONLY 4
    const socialLinks = [
        { icon: <FaWhatsapp />, label: 'WhatsApp', link: 'https://wa.me/+923191402404', color: 'hover:bg-green-600' },
        { icon: <FaFacebook />, label: 'Facebook', link: 'https://www.facebook.com/share/16nqTXfbEQ/', color: 'hover:bg-blue-600' },
        { icon: <FaInstagram />, label: 'Instagram', link: 'https://www.instagram.com/waled.khokhar?igsh=MWMxaW5ybDJ4NzY2cg==', color: 'hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600' },
        { icon: <FaTiktok />, label: 'TikTok', link: 'https://www.tiktok.com/@khokharmart', color: 'hover:bg-black' },
    ];

    // Quick navigation links - ALOE VERA ONLY
    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Aloe Vera', path: '/products' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
    ];

    // Payment methods - ONLY 2 (EasyPaisa + JazzCash) + COD
    const paymentMethods = [
        { name: 'EasyPaisa', icon: <FaMoneyBillWave />, bg: 'bg-green-600', text: 'text-white' },
        { name: 'JazzCash', icon: <FaMoneyBillWave />, bg: 'bg-red-600', text: 'text-white' },
    ];

    return (
        <footer className={`${darkMode ? 'bg-black' : 'bg-gray-900'} text-white pt-12 pb-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-700'}`}>
            <div className="container mx-auto px-4">
                
                {/* Main Grid: Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                    {/* Column 1: Brand */}
                    <div>
                        <h2 className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-3">
                            KHOKHARMART
                        </h2>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                            100% Pure Aloe Vera Gel<br />
                            Cold-pressed • No preservatives • Made in Pakistan
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm text-gray-400">
                            <div className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-green-500" />
                                <span>Islamabad, Pakistan 🇵🇰</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaPhone className="text-green-500" />
                                <a href="tel:+923191402404" className="hover:text-green-400 transition">+92 319 1402404</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-green-500" />
                                <a href="mailto:waleedkhokharbusiness@gmail.com" className="hover:text-green-400 transition truncate">
                                    waleedkhokharbusiness@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white border-b border-green-500/30 pb-2 inline-block">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link, idx) => (
                                <motion.li key={idx} whileHover={{ x: 5 }}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-green-400 transition flex items-center gap-2 text-sm"
                                    >
                                        <span className="text-green-500 text-xs">▶</span>
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Payment Methods - ONLY 2 */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white border-b border-green-500/30 pb-2 inline-block">
                            We Accept
                        </h3>
                        
                        {/* EasyPaisa & JazzCash - 2 ONLY */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {paymentMethods.map((method, idx) => (
                                <div 
                                    key={idx}
                                    className={`${method.bg} ${method.text} p-3 rounded-xl flex flex-col items-center justify-center`}
                                >
                                    <div className="text-2xl mb-1">{method.icon}</div>
                                    <span className="text-xs font-semibold">{method.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* COD */}
                        <div className="bg-gray-800 p-3 rounded-xl flex items-center justify-center gap-2">
                            <FaCreditCard className="text-green-500 text-xl" />
                            <span className="text-sm font-medium">Cash on Delivery</span>
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-3">
                            ✓ Secure • Fast • Reliable
                        </p>
                    </div>

                    {/* Column 4: Follow Us */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white border-b border-green-500/30 pb-2 inline-block">
                            Follow Us
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {socialLinks.map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`bg-gray-800 p-3 rounded-xl flex items-center gap-2 transition-all duration-300 ${social.color} hover:bg-opacity-100`}
                                >
                                    <div className="text-white text-xl">
                                        {social.icon}
                                    </div>
                                    <span className="text-white text-xs font-medium">
                                        {social.label}
                                    </span>
                                </motion.a>
                            ))}
                        </div>
                        
                        {/* WhatsApp Channel Link */}
                        <a 
                            href="https://wa.me/+923191402404"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 text-xs text-gray-400 hover:text-green-400 flex items-center gap-1 transition"
                        >
                            <FaWhatsapp className="text-green-500" />
                            Join our WhatsApp Channel
                        </a>
                    </div>
                </div>

                {/* Trust Badges - Minimal */}
                <div className="border-t border-gray-800 pt-6 mb-4">
                    <div className="flex flex-wrap justify-center gap-6">
                        {[
                            { icon: <FaTruck />, text: 'Free Shipping over Rs 2,000' },
                            { icon: <FaUndo />, text: '7 Day Returns' },
                            { icon: <FaShieldAlt />, text: '100% Pure Guarantee' },
                            { icon: <FaCreditCard />, text: 'COD Available' },
                        ].map((badge, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="text-green-500 text-lg">
                                    {badge.icon}
                                </div>
                                <span>{badge.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Copyright - Clean */}
                <div className="border-t border-gray-800 pt-4 text-center">
                    <p className="text-gray-500 text-xs">
                        © {currentYear} <span className="text-green-500 font-bold">KHOKHARMART</span> • 
                        100% Pure Aloe Vera • 
                        Made with ❤️ in <span className="text-green-400">Pakistan</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;