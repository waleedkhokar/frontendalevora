import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeaturedProducts = ({ darkMode }) => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ FIXED: ONLY USE REAL BACKEND IMAGES
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null; // Don't use fallback images
        
        // If already full URL
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // Clean path - remove any double slashes
        const cleanPath = imagePath.replace(/\/+/g, '/');
        
        // If it starts with /uploads
        if (cleanPath.startsWith('/uploads/')) {
            return `http://localhost:5000${cleanPath}`;
        }
        
        // If it starts with uploads (no slash)
        if (cleanPath.startsWith('uploads/')) {
            return `http://localhost:5000/${cleanPath}`;
        }
        
        // If it's just a filename
        if (!cleanPath.includes('/')) {
            return `http://localhost:5000/uploads/${cleanPath}`;
        }
        
        return `http://localhost:5000${cleanPath}`;
    };

    // Fetch featured products from backend
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                console.log('🔍 Fetching featured products...');
                const response = await fetch('http://localhost:5000/api/products');
                const result = await response.json();
                
                console.log('📦 API Response:', result);
                
                if (result.success && result.data) {
                    // ✅ FILTER ONLY PRODUCTS WITH REAL IMAGES
                    const featured = result.data
                        .filter(product => {
                            // Must be featured AND have an image
                            return product.featured === true && product.image;
                        })
                        .slice(0, 4)
                        .map(product => ({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            image: getImageUrl(product.image),
                            category: product.category || 'skincare',
                            description: product.description || '100% pure aloe vera gel',
                            stock: product.stock,
                            featured: product.featured
                        }))
                        .filter(product => product.image !== null); // Remove any with null images
                    
                    console.log('⭐ Featured Products Found:', featured);
                    setFeaturedProducts(featured);
                    
                    if (featured.length === 0) {
                        console.log('⚠️ No featured products with images found!');
                    }
                }
            } catch (error) {
                console.error('❌ Error fetching featured products:', error);
                setFeaturedProducts([]); // Empty array, no fallbacks
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    if (loading) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                </div>
            </section>
        );
    }

    // ✅ NO FALLBACK PRODUCTS - SHOW MESSAGE IF NONE
    if (featuredProducts.length === 0) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Aloe Vera</h2>
                    <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Our pure, cold-pressed collection
                    </p>
                    <Link
                        to="/products"
                        className={`inline-block px-8 py-3 rounded-full border-2 font-medium transition-all ${
                            darkMode 
                                ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black' 
                                : 'border-black text-black hover:bg-black hover:text-white'
                        }`}
                    >
                        Browse All Products →
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                        Featured Products
                    </h2>
                    <p className={`text-lg md:text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Our most trusted aloe vera collection
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {featuredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group"
                        >
                            <Link to={`/product/${product.id}`}>
                                <div className={`rounded-2xl overflow-hidden border ${
                                    darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'
                                } hover:shadow-xl transition-all duration-300 h-full flex flex-col`}>
                                    
                                    {/* ✅ ONLY REAL BACKEND IMAGES */}
                                    <div className="relative pt-[100%] bg-gray-100 dark:bg-gray-800">
                                        <img 
                                            src={product.image}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                console.error('❌ Image failed to load:', product.image);
                                                e.target.style.display = 'none';
                                                // Show fallback div instead of broken image
                                                e.target.parentElement.innerHTML += `
                                                    <div class="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                                        <span class="text-4xl">🌿</span>
                                                    </div>
                                                `;
                                            }}
                                        />
                                        {product.stock < 10 && (
                                            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                Low Stock
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="p-4 md:p-5 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className={`font-bold text-lg truncate ${
                                                darkMode ? 'text-white' : 'text-black'
                                            }`}>
                                                {product.name}
                                            </h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {product.category}
                                            </span>
                                        </div>
                                        
                                        <p className={`text-sm mb-4 line-clamp-2 ${
                                            darkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {product.description}
                                        </p>
                                        
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className={`text-xl font-bold ${
                                                darkMode ? 'text-yellow-500' : 'text-black'
                                            }`}>
                                                Rs {product.price.toLocaleString()}
                                            </span>
                                            <button 
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    darkMode 
                                                        ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' 
                                                        : 'bg-black/10 text-black hover:bg-black/20'
                                                }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // Add to cart logic
                                                    console.log('Added to cart:', product.id);
                                                }}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12 md:mt-16">
                    <Link
                        to="/products"
                        className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all ${
                            darkMode 
                                ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                                : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                        View All Products
                        <span>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;