import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/products/ProductCard';

const Products = ({ darkMode }) => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category') || 'all';
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        priceRange: [500, 2500] // ✅ Changed: Min Rs 500 to show all products
    });
    const [sortBy, setSortBy] = useState('featured');

    // Shuffle function
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Sort function
    const sortProducts = (products, sortType) => {
        const sorted = [...products];
        switch(sortType) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'popular':
                return sorted.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
            case 'rating':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'featured':
            default:
                return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
    };

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const result = await response.json();

                if (result.success && result.data) {
                    let allProducts = result.data.map(product => ({
                        _id: product._id,
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        category: product.category,
                        image: product.image,
                        description: product.description,
                        stock: product.stock,
                        rating: product.ratings || 4.5,
                        numReviews: product.numReviews || 0,
                        featured: product.featured || false,
                        bestSeller: product.bestSeller || false
                    }));

                    // Filter by category
                    let filtered = allProducts;
                    if (category !== 'all') {
                        filtered = allProducts.filter(p => p.category === category);
                    }

                    setProducts(filtered);
                    setFilteredProducts(filtered);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    // Apply filters and sort
    useEffect(() => {
        let filtered = [...products];
        
        // Price filter
        filtered = filtered.filter(p =>
            p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
        );
        
        // Apply sort
        filtered = sortProducts(filtered, sortBy);
        
        setFilteredProducts(filtered);
    }, [filters, products, sortBy]);

    const clearFilters = () => {
        setFilters({ priceRange: [500, 2500] }); // ✅ Changed to show all products
        setSortBy('featured');
    };

    const getDisplayProducts = () => {
        if (category === 'all') {
            return shuffleArray(filteredProducts);
        }
        return filteredProducts;
    };

    const displayProducts = getDisplayProducts();

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {category === 'all' ? 'Aloe Vera Collection' : 'Natural Skincare'}
                    </h1>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {filteredProducts.length} pure aloe vera products available
                        {category === 'all' && ' • 100% natural, cold-pressed'}
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <div className="lg:w-1/4">
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Filters</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-yellow-500 hover:text-yellow-400"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3">Category</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['all', 'skincare'].map((cat) => (
                                        <Link
                                            key={cat}
                                            to={`/products?category=${cat}`}
                                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                                                category === cat
                                                    ? 'bg-yellow-500 text-black font-medium'
                                                    : darkMode 
                                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                            }`}
                                        >
                                            {cat === 'all' ? '🌿 All Aloe Vera' : '🧴 Skincare'}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter - Fixed Range */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3">Price Range</h4>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Rs {filters.priceRange[0].toLocaleString()}</span>
                                            <span className="font-medium">Rs {filters.priceRange[1].toLocaleString()}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="500"
                                            max="2500"
                                            step="50"
                                            value={filters.priceRange[1]}
                                            onChange={(e) => setFilters({ 
                                                ...filters, 
                                                priceRange: [500, parseInt(e.target.value)]
                                            })}
                                            className="w-full accent-yellow-500"
                                        />
                                        <div className="flex justify-between text-xs opacity-75">
                                            <span>Min: Rs 500</span>
                                            <span>Max: Rs 2,500</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Filters */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3">Quick Filters</h4>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setFilters({ priceRange: [500, 1500] })}
                                        className={`px-3 py-1 rounded-full text-xs ${
                                            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    >
                                        Under Rs 1,500
                                    </button>
                                    <button
                                        onClick={() => setFilters({ priceRange: [1500, 2000] })}
                                        className={`px-3 py-1 rounded-full text-xs ${
                                            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    >
                                        Rs 1,500 - 2,000
                                    </button>
                                    <button
                                        onClick={() => setFilters({ priceRange: [2000, 2500] })}
                                        className={`px-3 py-1 rounded-full text-xs ${
                                            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    >
                                        Rs 2,000+
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="lg:w-3/4">
                        {/* Sort Bar */}
                        <div className="flex justify-between items-center mb-6">
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Showing {filteredProducts.length} products
                            </p>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={`px-4 py-2 rounded-lg text-sm border ${
                                    darkMode 
                                        ? 'bg-gray-900 border-gray-800 text-white' 
                                        : 'bg-white border-gray-300 text-black'
                                }`}
                            >
                                <option value="featured">Featured</option>
                                <option value="popular">Most Popular</option>
                                <option value="rating">Highest Rated</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="flex flex-col justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                    Loading pure aloe vera...
                                </p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🌿</div>
                                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                                <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Try adjusting your filters
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors inline-block"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayProducts.map((product, index) => (
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;