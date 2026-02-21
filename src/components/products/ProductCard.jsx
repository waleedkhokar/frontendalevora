import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, darkMode }) => {
    const { addToCart } = useCart();

    const rating = product.ratings || product.rating || 4.5;
    const numReviews = product.numReviews || 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: '250ml', // Default size
            quantity: 1
        });
        toast.success(`1 × ${product.name} added to cart!`);
    };

    return (
        <Link to={`/product/${product._id}`}>  
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl overflow-hidden border ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} transition-all duration-300 hover:shadow-xl`}
            >
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-gray-100">
                    {product.image ? (
                        <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center text-6xl bg-gray-100">
                                        🌿
                                    </div>
                                `;
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-100">
                            🌿
                        </div>
                    )}
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold text-lg truncate ${darkMode ? 'text-white' : 'text-black'}`}>
                            {product.name}
                        </h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            🌿 Skincare
                        </span>
                    </div>
                    
                    <p className={`text-sm mb-3 h-10 overflow-hidden ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {product.description}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                        <div className="flex text-yellow-500">
                            {Array.from({ length: 5 }, (_, i) => (
                                <span key={i}>
                                    {i < Math.floor(rating) ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <span className={`text-xs ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {rating.toFixed(1)} ({numReviews} reviews)
                        </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <span className={`text-xl font-bold ${darkMode ? 'text-green-500' : 'text-green-600'}`}>
                                Rs {product.price}
                            </span>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700"
                        >
                            Add to Cart
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;