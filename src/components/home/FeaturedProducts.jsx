import React from 'react';
import { motion } from 'framer-motion';

const FeaturedProducts = () => {
    const products = [
        { id: 1, name: "Classic Brown Leather", price: "Rs 12,999", image: "🧥" },
        { id: 2, name: "Black Bomber Jacket", price: "Rs 14,999", image: "🛡️" },
        { id: 3, name: "Designer Women's Jacket", price: "Rs 16,999", image: "👚" },
        { id: 4, name: "Kids Aviator Jacket", price: "Rs 8,999", image: "👦" },
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-white to-[#F5F5DC]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 font-serif">Featured Jackets</h2>
                    <p className="text-[#4E3529] max-w-2xl mx-auto">
                        Handpicked premium leather jackets showcasing Pakistani craftsmanship
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#FFF8E1]"
                        >
                            <div className="p-6">
                                <div className="text-8xl text-center mb-4">{product.image}</div>
                                <h3 className="text-lg font-semibold text-[#3E2723] mb-2">
                                    {product.name}
                                </h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-[#D4AF37]">
                                        {product.price}
                                    </span>
                                    <button className="px-4 py-2 bg-[#3E2723] text-white rounded-lg hover:bg-[#4E3529]">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;