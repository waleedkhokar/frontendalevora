import React from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const ProductGrid = ({ products, darkMode }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                >
                    <ProductCard product={product} darkMode={darkMode} />
                </motion.div>
            ))}
        </div>
    );
};

export default ProductGrid;