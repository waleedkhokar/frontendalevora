import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaTimes, FaSave, FaUpload, FaImage, FaTag,
  FaDollarSign, FaBox, FaStar, FaLeaf
} from 'react-icons/fa';

const ProductForm = ({ darkMode, product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'skincare',
    stock: '',
    featured: false,
    bestSeller: false,
    image: null,
    imagePreview: '',
    rating: 0,
    numReviews: 0,
    sizes: ['250ml', '500ml'] // Only 2 sizes
  });

  const [loading, setLoading] = useState(false);

  // Initialize form if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || 'skincare',
        stock: product.stock || 50,
        featured: product.featured || false,
        bestSeller: product.bestSeller || false,
        image: null,
        imagePreview: product.image 
          ? (product.image.startsWith('http') 
             ? product.image 
             : `http://localhost:5000/${product.image}`)
          : '',
        rating: product.ratings || 0,
        numReviews: product.numReviews || 0,
        sizes: product.sizes || ['250ml', '500ml']
      });
    }
  }, [product]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  // Handle size toggle (only 250ml/500ml)
  const handleToggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // ✅ PREVENT DOUBLE SUBMISSION
  if (loading) {
    console.log('⏸️ Already submitting, ignoring...');
    return;
  }
  
  const isEditing = !!product;
  
  if (!isEditing && !formData.image) {
    alert('❌ Please select an image for new product');
    return;
  }

  if (!formData.name || !formData.description || !formData.price || !formData.stock) {
    alert('❌ Please fill all required fields');
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('⚠️ Please login again');
      setLoading(false);
      return;
    }
    

      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', 'skincare'); // Fixed category
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('bestSeller', formData.bestSeller);
      formDataToSend.append('sizes', formData.sizes.join(','));
      formDataToSend.append('ratings', formData.rating);
      formDataToSend.append('numReviews', formData.numReviews || 0);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const url = product
        ? `http://localhost:5000/api/products/${product._id}`
        : 'http://localhost:5000/api/products';

      const response = await fetch(url, {
        method: product ? 'PUT' : 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const result = await response.json();

   if (result.success) {
  alert('✅ Product saved successfully!');
  
  if (!product) {
    setFormData({
      name: '', description: '', price: '', category: 'skincare',
      stock: '', featured: false, bestSeller: false,
      sizes: ['250ml', '500ml'], image: null, imagePreview: '', 
      rating: 0, numReviews: 0
    });
  }
  
  if (onSave) onSave(result.data);
  
  setLoading(false); // ✅ IMPORTANT - reset loading
} else {
        throw new Error(result.message || 'Failed to save product');
      }

    } catch (error) {
      console.error('❌ Submission Error:', error);
      alert('❌ Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Available sizes - ONLY 2
  const allSizes = ['250ml', '500ml'];

  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {product ? 'Update product details' : 'Create a new aloe vera product'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className={`p-2 rounded-full ${darkMode
            ? 'hover:bg-gray-800 text-gray-400'
            : 'hover:bg-gray-200 text-gray-600'
            }`}
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Debug Info */}
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
          <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
            <strong>Status:</strong> Selected image: <span className="font-bold">{formData.image ? formData.image.name : 'None'}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className={`block mb-2 font-medium flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FaTag />
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="e.g., 100% Pure Aloe Vera Gel - 250ml"
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-green-500 resize-none`}
                placeholder="Describe the aloe vera benefits, ingredients..."
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block mb-2 font-medium flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaDollarSign />
                  Price (Rs) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="500"
                  max="5000"
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="e.g., 990 or 1490"
                />
              </div>

              <div>
                <label className={`block mb-2 font-medium flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaBox />
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  max="1000"
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="e.g., 50"
                />
              </div>
            </div>

            {/* Category - FIXED to Skincare only */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Category *
              </label>
              <div className="p-3 rounded-lg border border-green-500 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center gap-2">
                  <FaLeaf className="text-green-600" />
                  <span className="font-medium">🌿 Skincare (Fixed)</span>
                  <input type="hidden" name="category" value="skincare" />
                </div>
              </div>
            </div>

            {/* Rating & Reviews Section */}
            <div className="space-y-4 pt-4 border-t dark:border-gray-700 border-gray-300">
              <div>
                <label className={`font-medium flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaStar />
                  Initial Rating (0-5)
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                    className={`w-24 px-3 py-2 rounded border ${darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                      }`}
                    placeholder="e.g., 4.5"
                  />
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <FaStar
                        key={star}
                        size={20}
                        className={`cursor-pointer ${star <= formData.rating ? 'text-yellow-500' : 'text-gray-400'}`}
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      />
                    ))}
                  </div>
                </div>
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  Average star rating (e.g., 4.5 = 4½ stars)
                </p>
              </div>

              {/* Number of Reviews Field */}
              <div>
                <label className={`font-medium block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Total Reviews Count
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  step="1"
                  value={formData.numReviews || 0}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    numReviews: parseInt(e.target.value) || 0 
                  }))}
                  className={`w-full px-3 py-2 rounded border ${darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                    }`}
                  placeholder="e.g., 12, 45, 100"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className={`block mb-2 font-medium flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FaImage />
                Product Image *
              </label>

              {/* Image Preview */}
              <div className="mb-4">
                <div className={`w-full h-48 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <FaImage className={`text-4xl mx-auto mb-2 ${darkMode ? 'text-gray-700' : 'text-gray-400'}`} />
                      <p className={darkMode ? 'text-gray-500' : 'text-gray-600'}>
                        No image selected
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <label className={`block w-full px-4 py-3 rounded-lg border ${darkMode
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                : 'bg-white border-gray-300 hover:bg-gray-50'
                } cursor-pointer text-center transition`}>
                <FaUpload className="inline mr-2" />
                {formData.image ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Recommended: 800x800px, Max 5MB
              </p>
            </div>

            {/* Sizes - ONLY 250ml and 500ml */}
            <div>
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Available Sizes
              </label>
              <div className="flex gap-4">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleToggleSize(size)}
                    className={`flex-1 px-6 py-4 rounded-xl border-2 transition ${
                      formData.sizes.includes(size)
                        ? 'bg-green-500 text-white border-green-600'
                        : darkMode
                          ? 'border-gray-700 text-gray-300 hover:border-green-500 bg-gray-900'
                          : 'border-gray-300 text-gray-700 hover:border-green-500 bg-white'
                    }`}
                  >
                    <div className="font-bold text-lg">{size}</div>
                    <div className="text-xs mt-1">
                      {size === '250ml' ? 'Trial' : 'Best Value'}
                    </div>
                  </button>
                ))}
              </div>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Select which sizes are available for this product
              </p>
            </div>

            {/* Featured & Best Seller Toggles */}
            <div className="space-y-4">
              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700 border-gray-300">
                <div className="flex items-center gap-3">
                  <FaStar className={formData.featured ? 'text-yellow-500' : darkMode ? 'text-gray-500' : 'text-gray-400'} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                      Featured Product
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Show on homepage
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer ${
                    darkMode
                      ? 'bg-gray-700 peer-checked:bg-green-600'
                      : 'bg-gray-300 peer-checked:bg-green-500'
                    } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>

              {/* Best Seller Toggle - NEW */}
              <div className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700 border-gray-300">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏆</span>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                      Best Seller
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Mark as top selling product
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="bestSeller"
                    checked={formData.bestSeller}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer ${
                    darkMode
                      ? 'bg-gray-700 peer-checked:bg-green-600'
                      : 'bg-gray-300 peer-checked:bg-green-500'
                    } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t dark:border-gray-800 border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 rounded-lg ${darkMode
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-black'
              }`}
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
              } transition`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                {product ? 'Update Product' : 'Create Product'}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;