import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaShoppingCart, FaStar, FaTruck, 
  FaShieldAlt, FaUndo, FaLeaf, FaBox,
  FaMinus, FaPlus, FaCheckCircle
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Product = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('250ml'); // Default 250ml
  const [quantity, setQuantity] = useState(1);
  
  // Price mapping for sizes
  const sizePrices = {
    '250ml': 990,
    '500ml': 1490
  };

  // Product images
  const productImages = product?.image ? [product.image] : [];

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setProduct(result.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      name: `${product.name} - ${selectedSize}`,
      price: sizePrices[selectedSize],
      image: product.image,
      size: selectedSize,
      quantity: quantity
    });
    
    alert(`✅ ${quantity} × ${product.name} (${selectedSize}) added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) { // Max 10 per order
      setQuantity(newQuantity);
    }
  };

  const getCurrentPrice = () => {
    return sizePrices[selectedSize] || product?.price || 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading aloe vera details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            Product Not Found
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {error || 'The product you are looking for does not exist.'}
          </p>
          <Link
            to="/products"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${
              darkMode 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            } transition`}
          >
            <FaArrowLeft />
            Browse Aloe Vera
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6">
        <ol className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/products" className="hover:underline">Aloe Vera</Link>
          </li>
          <li>/</li>
          <li className={`font-medium truncate max-w-xs ${darkMode ? 'text-white' : 'text-black'}`}>
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Back Button - Mobile */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            darkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } transition`}
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Image */}
        <div>
          <div className={`mb-4 rounded-2xl overflow-hidden border ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'
          }`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto aspect-square object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600?text=🌿+Aloe+Vera';
              }}
            />
          </div>
          
          {/* 100% Natural Badge */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
              🌿 100% Natural
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
              ❄️ Cold Pressed
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
              🇵🇰 Made in Pakistan
            </span>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div>
          {/* Category */}
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800`}>
              🌿 Natural Skincare
            </span>
          </div>

          {/* Product Name */}
          <h1 className={`text-3xl lg:text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-500">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar key={i} className={i < Math.floor(product.ratings || 4.5) ? 'fill-current' : 'fill-gray-300'} />
              ))}
            </div>
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {product.ratings?.toFixed(1) || '4.5'} ({product.numReviews || 47} reviews)
            </span>
          </div>

          {/* Price - Dynamic based on size */}
          <div className="mb-6">
            <span className={`text-4xl font-bold ${darkMode ? 'text-green-500' : 'text-green-600'}`}>
              Rs {getCurrentPrice().toLocaleString()}
            </span>
            <span className={`ml-3 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              for {selectedSize}
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
              Description
            </h3>
            <p className={`leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {product.description}
            </p>
          </div>

          {/* Size Selection - ONLY 2 SIZES */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
              Select Size
            </h3>
            <div className="flex gap-4">
              {/* 250ml Button */}
              <button
                onClick={() => setSelectedSize('250ml')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  selectedSize === '250ml'
                    ? 'bg-green-500 text-white border-green-600'
                    : darkMode
                      ? 'border-gray-700 text-gray-300 hover:border-green-500 bg-gray-900'
                      : 'border-gray-300 text-gray-700 hover:border-green-500 bg-white'
                }`}
              >
                <div className="font-bold text-lg">250ml</div>
                <div className={`text-sm ${selectedSize === '250ml' ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Rs 990
                </div>
                <div className="text-xs mt-1">Perfect for trial</div>
              </button>
              
              {/* 500ml Button */}
              <button
                onClick={() => setSelectedSize('500ml')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  selectedSize === '500ml'
                    ? 'bg-green-500 text-white border-green-600'
                    : darkMode
                      ? 'border-gray-700 text-gray-300 hover:border-green-500 bg-gray-900'
                      : 'border-gray-300 text-gray-700 hover:border-green-500 bg-white'
                }`}
              >
                <div className="font-bold text-lg">500ml</div>
                <div className={`text-sm ${selectedSize === '500ml' ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Rs 1,490
                </div>
                <div className="text-xs mt-1">Best value</div>
              </button>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
              Quantity
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Quantity Selector */}
              <div className={`flex items-center border rounded-lg ${
                darkMode ? 'border-gray-700' : 'border-gray-300'
              }`}>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className={`p-3 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} ${
                    quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaMinus />
                </button>
                <span className={`px-4 py-2 text-lg font-medium w-12 text-center ${
                  darkMode ? 'text-white' : 'text-black'
                }`}>
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                  className={`p-3 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} ${
                    quantity >= 10 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaPlus />
                </button>
              </div>

              {/* Stock Info */}
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaCheckCircle className="inline text-green-500 mr-1" />
                <span className="text-green-500 font-medium">In Stock</span>
                <span className="ml-1">({product.stock || 35} available)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                darkMode
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              } shadow-lg hover:shadow-xl`}
            >
              <FaShoppingCart />
              Add to Cart
            </button>
            
            <button
              onClick={handleBuyNow}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                darkMode
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90'
              } shadow-lg hover:shadow-xl`}
            >
              Buy Now
            </button>
          </div>

          {/* Benefits Tags */}
          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="text-green-500 text-xl mb-1">🌿</div>
              <div className="text-xs font-medium">100% Pure</div>
            </div>
            <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="text-green-500 text-xl mb-1">❄️</div>
              <div className="text-xs font-medium">Cold Pressed</div>
            </div>
            <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="text-green-500 text-xl mb-1">🧴</div>
              <div className="text-xs font-medium">Multi-Purpose</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Aloe Vera Specific */}
      <div className="mt-16">
        <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-black'}`}>
          Why Choose KhokharMart Aloe Vera?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <FaTruck />, title: 'Free Shipping', desc: 'Free delivery on orders above Rs 2,000' },
            { icon: <FaUndo />, title: '7 Day Returns', desc: 'Easy returns, no questions asked' },
            { icon: <FaShieldAlt />, title: '100% Pure', desc: 'No water, no preservatives, no additives' },
            { icon: <FaLeaf />, title: 'Natural Skincare', desc: 'Cold-pressed, retains all nutrients' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl text-center border ${
                darkMode 
                  ? 'bg-gray-900 border-gray-800 hover:border-green-500' 
                  : 'bg-gray-50 border-gray-200 hover:border-green-500'
              } transition-all duration-300`}
            >
              <div className={`inline-flex p-3 rounded-full text-2xl mb-4 text-green-500`}>
                {feature.icon}
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                {feature.title}
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;