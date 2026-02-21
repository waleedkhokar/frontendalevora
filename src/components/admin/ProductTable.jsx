import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaEdit, FaTrash, FaStar, FaEye, FaCheck, FaTimes,
  FaImage, FaBox, FaTag, FaShoppingCart, FaFilter, FaLeaf
} from 'react-icons/fa';

const ProductTable = ({
  products,
  darkMode,
  onEdit,
  onDelete,
  onView,
  onToggleFeatured,
  onToggleBestSeller,
  onQuickStockUpdate,
  selectedProducts,
  onSelectProduct,
  onSelectAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // ✅ FIXED: Proper image URL helper
 const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // Cloudinary URLs already start with http
  return imagePath;
};

  // Filter products
  const filteredProducts = products.filter(product => {
    if (!product || !product.name) return false;

    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Categories - ONLY Skincare
  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'skincare', label: '🌿 Skincare' }
  ];

  // Status badge with better styling
  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return { 
        text: 'Out of Stock', 
        color: 'red',
        bgColor: darkMode ? 'bg-red-900/30' : 'bg-red-100',
        textColor: darkMode ? 'text-red-400' : 'text-red-700'
      };
    }
    if (stock < 10) {
      return { 
        text: 'Low Stock', 
        color: 'yellow',
        bgColor: darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100',
        textColor: darkMode ? 'text-yellow-400' : 'text-yellow-700'
      };
    }
    return { 
      text: 'In Stock', 
      color: 'green',
      bgColor: darkMode ? 'bg-green-900/30' : 'bg-green-100',
      textColor: darkMode ? 'text-green-400' : 'text-green-700'
    };
  };

  return (
    <div className={`rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg overflow-hidden`}>
      {/* Table Header with Controls */}
      <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
              Aloe Vera Products
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {products.length} total products • {filteredProducts.length} filtered
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search aloe vera..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border ${darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-black placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64`}
              />
              <FaFilter className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${darkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-black'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={onSelectAll}
                  className={`h-4 w-4 rounded ${darkMode
                    ? 'bg-gray-800 border-gray-600 checked:bg-green-500'
                    : 'bg-white border-gray-300 checked:bg-green-500'
                    }`}
                />
              </th>
              <th className={`text-left p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Product
              </th>
              <th className={`text-left p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Category
              </th>
              <th className={`text-left p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Price
              </th>
              <th className={`text-left p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Stock
              </th>
              <th className={`text-left p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Featured
              </th>
              <th className={`text-left p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Best Seller
              </th>
              <th className={`text-left p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product, index) => {
              const stock = product.stock || 0;
              const stockBadge = getStockBadge(stock);

              return (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b ${darkMode
                    ? 'border-gray-800 hover:bg-gray-800/50'
                    : 'border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  {/* Checkbox */}
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => onSelectProduct(product._id)}
                      className={`h-4 w-4 rounded ${darkMode
                        ? 'bg-gray-800 border-gray-600 checked:bg-green-500'
                        : 'bg-white border-gray-300 checked:bg-green-500'
                        }`}
                    />
                  </td>

                  {/* Product Info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-16 h-16 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        {product.image ? (
                          <img 
                            src={getImageUrl(product.image)} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-3xl">🌿</div>';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            🌿
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
                          {product.name}
                        </h3>
                        <p className={`text-sm line-clamp-1 max-w-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {product.description?.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      🌿 Skincare
                    </span>
                  </td>

                  {/* Price */}
                  <td className={`p-4 font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Rs {product.price?.toLocaleString() || '0'}
                  </td>

                  {/* Stock - WITH QUICK EDIT */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {/* Stock Number */}
                        <span className={`font-medium ${stockBadge.textColor}`}>
                          {stock}
                        </span>
                        
                        {/* Stock Badge */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockBadge.bgColor} ${stockBadge.textColor}`}>
                          {stockBadge.text}
                        </span>
                        
                        {/* Quick Edit Buttons */}
                        {onQuickStockUpdate && (
                          <div className="flex items-center gap-1 ml-2">
                            <button 
                              onClick={() => onQuickStockUpdate(product._id, Math.max(0, stock - 1))}
                              className={`px-2 py-1 rounded text-xs ${darkMode 
                                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300 text-black'
                              }`}
                              title="Decrease stock"
                            >
                              -
                            </button>
                            <button 
                              onClick={() => onQuickStockUpdate(product._id, stock + 1)}
                              className={`px-2 py-1 rounded text-xs ${darkMode 
                                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300 text-black'
                              }`}
                              title="Increase stock"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Featured */}
                  <td className="p-4">
                    <button
                      onClick={() => onToggleFeatured(product._id, !product.featured)}
                      className={`p-2 rounded-full ${product.featured
                        ? darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                        : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                        } hover:opacity-90 transition`}
                      title={product.featured ? 'Unmark as Featured' : 'Mark as Featured'}
                    >
                      {product.featured ? <FaStar /> : <FaStar className="opacity-50" />}
                    </button>
                  </td>

                  {/* Best Seller */}
                  <td className="p-4">
                    <button
                      onClick={() => onToggleBestSeller(product._id, !product.bestSeller)}
                      className={`p-2 rounded-full ${product.bestSeller
                        ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                        : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                        } hover:opacity-90 transition`}
                      title={product.bestSeller ? 'Remove Best Seller' : 'Mark as Best Seller'}
                    >
                      {product.bestSeller ? '🏆' : '🏆'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView && onView(product._id)}
                        className={`p-2 rounded-lg ${darkMode
                          ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          } transition`}
                        title="View"
                      >
                        <FaEye />
                      </button>

                      <button
                        onClick={() => onEdit(product)}
                        className={`p-2 rounded-lg ${darkMode
                          ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                          } transition`}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => onDelete(product._id)}
                        className={`p-2 rounded-lg ${darkMode
                          ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                          } transition`}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="8" className="p-8 text-center">
                  <div className={`py-8 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    <FaLeaf className="text-4xl mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No aloe vera products found</p>
                    {searchTerm && (
                      <p className="text-sm mt-2">
                        Try different search terms or clear filters
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {selectedProducts.length > 0 && (
        <div className={`p-4 border-t ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {selectedProducts.length} product(s) selected
            </span>
            <button
              onClick={() => {
                if (window.confirm(`Delete ${selectedProducts.length} selected products?`)) {
                  // Bulk delete handled by parent
                  console.log('Bulk delete:', selectedProducts);
                }
              }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${darkMode
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
                } transition`}
            >
              <FaTrash />
              Delete Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;