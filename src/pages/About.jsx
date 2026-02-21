import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = ({ darkMode }) => {
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
                            Pure <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Natural</span> Skincare
                        </h1>
                        <p className="text-xl md:text-2xl opacity-80 mb-6">
                            100% pure, cold-pressed aloe vera gel. No water, no preservatives, no additives — just nature's best for your skin.
                        </p>
                        <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto">
                    
                    {/* Mission Section */}
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}
                        >
                            <h2 className="text-3xl font-bold mb-4">100% Pure. Honestly Pure.</h2>
                            <p className="text-lg mb-4">
                                No hidden ingredients. No dilution. Just pure aloe vera, cold-pressed to retain every nutrient, vitamin, and enzyme nature intended.
                            </p>
                            <p className="opacity-80">
                                From sunburn relief to daily moisturizing, hair care to acne treatment — one gel, endless possibilities. Made for Pakistani skin, trusted by thousands.
                            </p>
                        </motion.div>
                        
                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className={`aspect-square rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                                <img 
                                    src="/uploads/Aloe Vera.jfif"
                                    alt="KhokharMart Aloe Vera Gel"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = `
                                            <div class="w-full h-full flex items-center justify-center text-6xl">
                                                🌿
                                            </div>
                                        `;
                                    }}
                                />
                            </div>
                            <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-xl ${darkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-100 border border-green-300'} backdrop-blur-sm flex items-center justify-center text-3xl`}>
                                🌱
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* For Everyone Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
                            Made for <span className="text-green-500">Every Skin Type</span>
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: "🧴", title: "Dry Skin", desc: "Deep hydration without oily residue" },
                                { icon: "☀️", title: "Sunburn Relief", desc: "Instantly cools and heals sun-damaged skin" },
                                { icon: "✨", title: "Acne Prone", desc: "Non-comedogenic, reduces breakouts naturally" },
                                { icon: "💇‍♀️", title: "Hair Care", desc: "Natural conditioner, reduces frizz & dandruff" },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.12 }}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    className={`p-6 rounded-2xl border backdrop-blur-md ${
                                        darkMode
                                            ? 'bg-gray-900/40 border-gray-800 hover:border-green-500/60'
                                            : 'bg-white/70 border-gray-200 hover:border-green-500/80'
                                    } transition-all duration-300`}
                                >
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="opacity-80 text-sm leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className={`p-10 rounded-3xl ${
                        darkMode 
                            ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
                            : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
                    } border ${darkMode ? 'border-gray-800' : 'border-gray-200'} mb-20`}>
                        
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-black text-center mb-10">
                                Why <span className="text-green-500">KhokharMart</span> Aloe Vera?
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {[
                                    "🌿 100% pure aloe vera — no water added",
                                    "❄️ Cold-pressed process retains nutrients",
                                    "🧪 Lab tested & certified",
                                    "🇵🇰 Made in Pakistan with international standards",
                                    "🧴 Multi-purpose: face, hair, body",
                                    "🚚 Fast delivery across Pakistan (COD available)",
                                    "💚 No parabens, no sulfates, no alcohol",
                                    "♻️ Eco-friendly glass bottles"
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.08 }}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="text-green-500 mt-1 text-xl">✓</span>
                                        <span className="opacity-90 leading-relaxed">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Switch to Natural Skincare?</h2>

                        <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                            Join thousands of customers across Pakistan who trust 
                            <span className="font-bold text-green-500"> KhokharMart</span> for 100% pure, chemical-free aloe vera.  
                            Your skin deserves nature's best.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/products"
                                className={`px-8 py-3 rounded-full font-bold border 
                                    ${darkMode 
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-700 hover:shadow-lg hover:shadow-green-500/40' 
                                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-700 hover:shadow-lg hover:shadow-green-500/30'
                                    } transition-all duration-300`}
                            >
                                🌿 Shop Aloe Vera
                            </Link>

                            <Link
                                to="/contact"
                                className={`px-8 py-3 rounded-full font-bold border ${darkMode 
                                    ? 'border-gray-700 hover:border-green-500 hover:bg-green-500/10' 
                                    : 'border-gray-300 hover:border-green-600 hover:bg-green-50'
                                } transition-all duration-300`}
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;