
import React from 'react';
import { motion } from 'framer-motion';

const WhyJavaScript  = ({ darkMode }) => {
 const features = [
    {
        icon: "🌿",
        title: "100% Pure",
        description: "Cold-pressed aloe vera, no water added"
    },
    {
        icon: "🧪",
        title: "Lab Tested",
        description: "Third-party tested for purity & safety"
    },
    {
        icon: "🏭",
        title: "Made in Pakistan",
        description: "Produced in Islamabad with quality standards"
    },
    {
        icon: "🌱",
        title: "Organic",
        description: "No pesticides, no chemicals, naturally grown"
    },
    {
        icon: "💚",
        title: "Skin Friendly",
        description: "For face, hair, body - all skin types"
    },
    {
        icon: "🚚",
        title: "Fast Delivery",
        description: "2-5 days across Pakistan, COD available"
    }
];

    return (
        <div className={`py-20 ${
            darkMode 
                ? 'bg-gradient-to-b from-black to-gray-900' 
                : 'bg-gradient-to-b from-white to-gray-100'
        }`}>
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black mb-4"
                    >
                        Why JAVASCRIPT?
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className={`text-lg max-w-2xl mx-auto ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                    >
                        100% pure aloe vera. No preservatives. No additives.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`p-8 rounded-2xl transition-all ${
                                darkMode
                                    ? 'bg-gray-900/50 border border-gray-800 hover:border-yellow-500/30'
                                    : 'bg-white border border-gray-200 hover:border-black/30'
                            } hover:shadow-xl`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`text-4xl p-3 rounded-xl ${
                                    darkMode 
                                        ? 'bg-yellow-500/10 text-yellow-500' 
                                        : 'bg-black/10 text-black'
                                }`}>
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold mb-2 ${
                                        darkMode ? 'text-white' : 'text-black'
                                    }`}>
                                        {feature.title}
                                    </h3>
                                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Location Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <div className={`inline-flex items-center px-6 py-3 rounded-full ${
                        darkMode 
                            ? 'bg-gray-900 border border-gray-800' 
                            : 'bg-white border border-gray-300'
                    }`}>
                        <span className="mr-3">🇵🇰</span>
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Proudly made in <strong>Rawalakot, Pakistan</strong>
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default WhyJavaScript;
