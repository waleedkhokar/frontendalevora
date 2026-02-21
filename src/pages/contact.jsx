import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaFacebook, FaInstagram, FaWhatsapp, FaTiktok,
    FaMapMarkerAlt, FaPhone, FaEnvelope, 
    FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaClock
} from 'react-icons/fa';

const Contact = ({ darkMode }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // Social links - WhatsApp FIRST, then channel links
    const socialLinks = [
        { icon: <FaWhatsapp />, label: 'WhatsApp', link: 'https://wa.me/+923191402404', color: 'bg-green-600' },
        { icon: <FaFacebook />, label: 'Facebook', link: 'https://www.facebook.com/share/16nqTXfbEQ/', color: 'bg-blue-700' },
        { icon: <FaInstagram />, label: 'Instagram', link: 'https://www.instagram.com/waled.khokhar?igsh=MWMxaW5ybDJ4NzY2cg==', color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
        { icon: <FaTiktok />, label: 'TikTok', link: 'https://www.tiktok.com/@khokharmart', color: 'bg-black' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setIsSuccess(false);

        const formData = new FormData(e.target);
        const data = {
            from_name: formData.get('from_name'),
            from_email: formData.get('from_email'),
            subject: formData.get('subject') || 'General Inquiry',
            message: formData.get('message')
        };

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setIsSuccess(true);
                e.target.reset();
                
                setTimeout(() => {
                    setIsSuccess(false);
                }, 4000);
                
            } else {
                setError(result.message || 'Failed to send message');
                setTimeout(() => {
                    setError('');
                }, 3000);
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to send message. Click "Direct Email" button below.');
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDirectEmail = () => {
        window.location.href = 'mailto:waleedkhokharbusiness@gmail.com?subject=KhokharMart Aloe Vera Inquiry';
    };

    const handleWhatsApp = () => {
        window.open('https://wa.me/+923191402404?text=Hi! I have a question about KhokharMart Aloe Vera Gel.', '_blank');
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} transition-colors duration-300`}>
            <div className="container mx-auto px-4 py-12">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className={`text-4xl md:text-5xl font-black mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                        Get In <span className="text-green-500">Touch</span>
                    </h1>
                    <p className={`text-lg md:text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                        Questions about our 100% pure aloe vera? Need help with your order? 
                        We typically reply within <span className="font-bold text-green-500">4-6 hours</span>.
                    </p>
                    <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full mt-6"></div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    
                    {/* Left Column: Contact Information & Social */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Contact Info Cards */}
                        <div className="space-y-6 mb-8">
                            {/* WhatsApp - TOP PRIORITY */}
                            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg border-l-4 border-green-500`}>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                                        <FaWhatsapp className={`text-2xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-black'}`}>
                                            WhatsApp
                                        </h3>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Fastest response · <span className="text-green-500 font-semibold">Under 2 hours</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a 
                                        href="https://wa.me/+923191402404"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-lg font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'} hover:underline flex items-center gap-2`}
                                    >
                                        <FaWhatsapp /> +92 319 1402404
                                    </a>
                                    <button
                                        onClick={handleWhatsApp}
                                        className={`text-sm px-4 py-2 rounded-full ${darkMode ? 'bg-green-900 text-green-300 hover:bg-green-800' : 'bg-green-100 text-green-700 hover:bg-green-200'} transition hover:scale-105 flex items-center gap-1 w-fit`}
                                    >
                                        <FaWhatsapp />
                                        Chat Now
                                    </button>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                                        <FaPhone className={`text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                                            Call Us
                                        </h3>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Mon-Sat · 10am - 8pm
                                        </p>
                                    </div>
                                </div>
                                <a 
                                    href="tel:+923191402404"
                                    className={`text-lg font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                                >
                                    +92 319 1402404
                                </a>
                            </div>

                            {/* Email - KEEPING YOUR OLD EMAIL */}
                            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`p-3 rounded-full ${darkMode ? 'bg-red-900' : 'bg-red-100'}`}>
                                        <FaEnvelope className={`text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                                            Email Us
                                        </h3>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Response in <span className="text-green-500 font-semibold">4-6 hours</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <a 
                                        href="mailto:waleedkhokharbusiness@gmail.com"
                                        className={`text-lg font-semibold ${darkMode ? 'text-red-400' : 'text-red-600'} hover:underline truncate`}
                                    >
                                        waleedkhokharbusiness@gmail.com
                                    </a>
                                    <button
                                        onClick={handleDirectEmail}
                                        className={`text-sm px-4 py-2 rounded-full ${darkMode ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-100 text-red-700 hover:bg-red-200'} transition hover:scale-105 flex items-center gap-1 w-fit`}
                                    >
                                        <FaEnvelope />
                                        Direct Email
                                    </button>
                                </div>
                            </div>

                            {/* Location - ISLAMABAD */}
                            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                                        <FaMapMarkerAlt className={`text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                                            Our Location
                                        </h3>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Serving customers across Pakistan
                                        </p>
                                    </div>
                                </div>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                                    Islamabad, Pakistan 🇵🇰
                                </p>
                                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Online store · Free delivery all over Pakistan
                                </p>
                            </div>
                        </div>

                        {/* Social Media Links - WhatsApp FIRST, then 4 channels */}
                        <div>
                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Connect With Us
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {socialLinks.map((social, idx) => (
                                    <motion.a
                                        key={idx}
                                        whileHover={{ scale: 1.05, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${social.color} p-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl`}
                                        aria-label={social.label}
                                    >
                                        <div className="text-white text-2xl">
                                            {social.icon}
                                        </div>
                                        <span className="text-white text-xs mt-2 font-medium">
                                            {social.label}
                                        </span>
                                    </motion.a>
                                ))}
                            </div>
                            {/* WhatsApp Channel Link - Under WhatsApp icon */}
                            <div className="mt-3 text-center">
                                <a 
                                    href="https://whatsapp.com/channel/0029VaXXXXXXXX" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`text-sm ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition flex items-center justify-center gap-1`}
                                >
                                    <FaWhatsapp /> Join our WhatsApp Channel
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl`}>
                            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Send Us a Message
                            </h2>
                            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                We'll get back to you within <span className="font-bold text-green-500">4-6 hours</span> ⚡
                            </p>
                            
                            {/* Success/Error Messages */}
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 rounded-lg bg-green-900/30 border border-green-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaCheckCircle className="text-green-500 text-xl" />
                                        <div>
                                            <p className="text-green-400 font-semibold">Message Sent Successfully!</p>
                                            <p className="text-green-300 text-sm">
                                                We'll reply within 4-6 hours. Thank you!
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaExclamationCircle className="text-red-500 text-xl" />
                                        <div>
                                            <p className="text-red-400 font-semibold">Error</p>
                                            <p className="text-red-300 text-sm">{error}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Contact Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="from_name" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="from_name"
                                            name="from_name"
                                            required
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition`}
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="from_email" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="from_email"
                                            name="from_email"
                                            required
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition`}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Subject
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition`}
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="Product Question">🌿 Aloe Vera Product Question</option>
                                        <option value="Order Support">📦 Order Support</option>
                                        <option value="Wholesale">🤝 Wholesale Inquiry</option>
                                        <option value="Delivery">🚚 Delivery Question</option>
                                        <option value="Other">💬 Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Your Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="4"
                                        required
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none`}
                                        placeholder="Tell us about your inquiry..."
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                                        isSubmitting 
                                            ? 'bg-gray-600 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-lg hover:shadow-green-500/30'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane />
                                            Send Message
                                        </>
                                    )}
                                </motion.button>

                                {/* Response Time Badge */}
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <FaClock className="text-green-500" />
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Average response: <span className="font-bold text-green-500">4-6 hours</span>
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Business Hours */}
                        <div className={`mt-6 p-6 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
                            <div className="flex items-center gap-3 mb-4">
                                <FaClock className={`text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-black'}`}>
                                    Customer Support Hours
                                </h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Monday - Saturday</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}>10:00 AM - 8:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Sunday</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}>12:00 PM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-700/30">
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Response Time</span>
                                    <span className="text-green-500 font-bold bg-green-500/10 px-3 py-1 rounded-full text-sm">
                                        ⚡ 4-6 Hours
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;