import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Categories = ({ darkMode }) => {
    const categories = [
        { 
            id: 1, 
            title: "Men's Collection", 
            description: "Premium hoodies for men",
            image: "👨‍💻",
            count: "12+ Styles",
            gradient: darkMode ? "from-blue-900/20 to-cyan-900/10" : "from-blue-50 to-cyan-50",
            link: "/products?category=men"
        },
        { 
            id: 2, 
            title: "Women's Collection", 
            description: "Elegant hoodies for women",
            image: "👩‍💻",
            count: "10+ Styles",
            gradient: darkMode ? "from-pink-900/20 to-rose-900/10" : "from-pink-50 to-rose-50",
            link: "/products?category=women"
        },
        { 
            id: 3, 
            title: "Limited Edition", 
            description: "Exclusive designs",
            image: "⭐",
            count: "5 Styles",
            gradient: darkMode ? "from-yellow-900/20 to-orange-900/10" : "from-yellow-50 to-orange-50",
            link: "/products?collection=limited"
        }
    ];

    return (
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-black mb-4"
                >
                    Shop by Category
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                    Find your perfect hoodie
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        whileHover={{ y: -5 }}
                    >
                        <Link to={category.link}>
                            <div className={`h-full rounded-3xl overflow-hidden transition-all duration-300 ${
                                darkMode 
                                    ? 'bg-gray-900 border border-gray-800 hover:border-yellow-500/30' 
                                    : 'bg-white border border-gray-200 hover:border-black/30'
                            } hover:shadow-2xl`}>
                                {/* Category Header */}
                                <div className={`p-8 bg-gradient-to-br ${category.gradient}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-6xl">{category.image}</div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            darkMode 
                                                ? 'bg-black/30 text-white' 
                                                : 'bg-white/80 text-black'
                                        }`}>
                                            {category.count}
                                        </span>
                                    </div>
                                    <h3 className={`text-2xl font-bold mb-2 ${
                                        darkMode ? 'text-white' : 'text-black'
                                    }`}>
                                        {category.title}
                                    </h3>
                                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {category.description}
                                    </p>
                                </div>
                                
                                {/* Footer */}
                                <div className={`p-6 border-t ${
                                    darkMode ? 'border-gray-800' : 'border-gray-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span className={`font-medium ${
                                            darkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            Explore Collection
                                        </span>
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                darkMode ? 'bg-yellow-500/10' : 'bg-black/10'
                                            }`}
                                        >
                                            →
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
