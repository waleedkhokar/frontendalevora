import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductTable from '../components/admin/ProductTable';
import ProductForm from '../components/admin/ProductForm';
import { 
  FaPlus, FaSync, FaDownload, FaUpload, FaChartLine,
  FaBox, FaFilter, FaSearch, FaCog, FaDatabase,
  FaStar, FaTrash, FaUsers, FaDollarSign, FaExclamationTriangle,
  FaLeaf
} from 'react-icons/fa';

const AdminProducts = ({ darkMode }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    skincare: 0,
    featured: 0,
    outOfStock: 0,
    lowStock: 0,
    bestSellers: 0
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
   // ✅ Read the key you actually saved
const token = localStorage.getItem('adminToken');  // ✅ Correct
      
      const response = await axios.get('http://localhost:5000/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setProducts(response.data.data || response.data.products);
        calculateStats(response.data.data || response.data.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
const calculateStats = (productsData) => {
    if (!productsData || !Array.isArray(productsData)) return;
    
    const stats = {
        total: productsData.length,
        skincare: productsData.filter(p => p && p.category === 'skincare').length,
        featured: productsData.filter(p => p && p.featured).length,
        outOfStock: productsData.filter(p => p && p.stock <= 0).length,
        lowStock: productsData.filter(p => p && p.stock > 0 && p.stock <= 10).length,
        bestSellers: productsData.filter(p => p && p.bestSeller).length
    };
    setStats(stats);
};

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle product edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Handle product delete
const handleDelete = async (productId) => {
  if (!window.confirm('Are you sure you want to delete this product?')) {
    return;
  }

  try {
    const token = localStorage.getItem('adminToken');
    await axios.delete(`http://localhost:5000/api/products/${productId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // ✅ SAFETY CHECK
    if (products && Array.isArray(products)) {
      setProducts(products.filter(p => p && p._id !== productId));
    }
    alert('✅ Product deleted successfully!');
  } catch (err) {
    console.error('Delete error:', err);
    alert('Failed to delete product. Please try again.');
  }
};

  // Handle toggle featured
 const handleToggleFeatured = async (productId, featured) => {
  try {
    const token = localStorage.getItem('adminToken');
    await axios.put(`http://localhost:5000/api/products/${productId}`, {
      featured
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // ✅ SAFETY CHECK
    if (products && Array.isArray(products)) {
      setProducts(products.map(p => 
        p && p._id === productId ? { ...p, featured } : p
      ));
    }
  } catch (err) {
    console.error('Toggle featured error:', err);
  }
};

  // Handle toggle best seller
const handleToggleBestSeller = async (productId, bestSeller) => {
  try {
    const token = localStorage.getItem('adminToken');
    await axios.put(`http://localhost:5000/api/products/${productId}`, {
      bestSeller
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // ✅ SAFETY CHECK
    if (products && Array.isArray(products)) {
      setProducts(products.map(p => 
        p && p._id === productId ? { ...p, bestSeller } : p
      ));
    }
  } catch (err) {
    console.error('Toggle best seller error:', err);
  }
};

  // Handle product selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id));
    }
  };

  // Handle form save
 const handleSaveProduct = async (formData) => {
  try {
    const token = localStorage.getItem('adminToken');
    
    const url = editingProduct 
      ? `http://localhost:5000/api/products/${editingProduct._id}`
      : 'http://localhost:5000/api/products';
      
    const response = await fetch(url, {
      method: editingProduct ? 'PUT' : 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (data.success) {
      // ✅ SAFETY CHECKS
      if (editingProduct) {
        if (products && Array.isArray(products)) {
          setProducts(products.map(p => 
            p && p._id === editingProduct._id ? data.data : p
          ));
        }
      } else {
        if (products && Array.isArray(products)) {
          setProducts([data.data, ...products]);
        } else {
          setProducts([data.data]);
        }
      }
      
      alert('✅ Product saved successfully!');
      setShowForm(false);
      setEditingProduct(null);
      if (products && Array.isArray(products)) {
        calculateStats(editingProduct ? products : [data.data, ...products]);
      }
    }
    
  } catch (error) {
    console.error('❌ Save error:', error);
    alert('Failed to save product: ' + error.message);
  }
};
  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    if (!window.confirm(`Delete ${selectedProducts.length} selected products?`)) {
      return;
    }

    try {
   // ✅ Read the key you actually saved
const token = localStorage.getItem('adminToken');
      await axios.post('http://localhost:5000/api/admin/products/bulk/delete', {
        productIds: selectedProducts
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setProducts(products.filter(p => !selectedProducts.includes(p._id)));
      setSelectedProducts([]);
      alert(`✅ ${selectedProducts.length} products deleted successfully!`);
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Failed to delete products. Please try again.');
    }
  };

  // Export products
  const handleExport = () => {
    const exportData = products.map(p => ({
      name: p.name,
      price: p.price,
      category: p.category,
      stock: p.stock,
      featured: p.featured,
      bestSeller: p.bestSeller,
      description: p.description,
      image: p.image
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `khokharmart-products-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Quick stock update function
  const handleQuickStockUpdate = async (productId, newStock) => {
  try {
    const token = localStorage.getItem('adminToken');
    await axios.put(`http://localhost:5000/api/products/${productId}`, {
      stock: parseInt(newStock)
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // ✅ SAFETY CHECK
    if (products && Array.isArray(products)) {
      const updatedProducts = products.map(p => 
        p && p._id === productId ? { ...p, stock: parseInt(newStock) } : p
      );
      setProducts(updatedProducts);
      calculateStats(updatedProducts);
    }
  } catch (err) {
    console.error('Stock update error:', err);
    alert('Failed to update stock. Please try again.');
  }
};
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading aloe vera products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-0 m-0 ml-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
            Product Management
          </h1>
          <p className={`text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage KhokharMart Aloe Vera collection ({stats.total} products)
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className={`px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 text-sm md:text-base bg-green-600 text-white hover:bg-green-700 transition active:scale-95`}
          >
            <FaPlus className="text-sm md:text-base" />
            <span className="hidden sm:inline">Add New Product</span>
            <span className="sm:hidden">Add</span>
          </button>
          
          <button
            onClick={fetchProducts}
            className={`px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 text-sm md:text-base ${
              darkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition active:scale-95`}
          >
            <FaSync className="text-sm md:text-base" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <button
            onClick={handleExport}
            className={`px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 text-sm md:text-base ${
              darkMode 
                ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            } transition active:scale-95`}
          >
            <FaDownload className="text-sm md:text-base" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 mb-10">
        {[
          { 
            title: 'Total Products', 
            value: stats.total, 
            icon: <FaBox />, 
            color: darkMode ? 'text-green-400' : 'text-green-600',
            bgColor: darkMode ? 'bg-green-900/20' : 'bg-green-50',
            borderColor: darkMode ? 'border-green-800' : 'border-green-200'
          },
          { 
            title: 'Skincare', 
            value: stats.skincare, 
            icon: <FaLeaf />, 
            color: darkMode ? 'text-emerald-400' : 'text-emerald-600',
            bgColor: darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50',
            borderColor: darkMode ? 'border-emerald-800' : 'border-emerald-200'
          },
          { 
            title: 'Featured', 
            value: stats.featured, 
            icon: <FaStar />, 
            color: darkMode ? 'text-yellow-400' : 'text-yellow-600',
            bgColor: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50',
            borderColor: darkMode ? 'border-yellow-800' : 'border-yellow-200'
          },
          { 
            title: 'Best Sellers', 
            value: stats.bestSellers, 
            icon: <FaChartLine />, 
            color: darkMode ? 'text-purple-400' : 'text-purple-600',
            bgColor: darkMode ? 'bg-purple-900/20' : 'bg-purple-50',
            borderColor: darkMode ? 'border-purple-800' : 'border-purple-200'
          },
          { 
            title: 'Out of Stock', 
            value: stats.outOfStock, 
            icon: <FaBox />, 
            color: darkMode ? 'text-red-400' : 'text-red-600',
            bgColor: darkMode ? 'bg-red-900/20' : 'bg-red-50',
            borderColor: darkMode ? 'border-red-800' : 'border-red-200'
          },
          { 
            title: 'Low Stock', 
            value: stats.lowStock, 
            icon: <FaExclamationTriangle />, 
            color: darkMode ? 'text-orange-400' : 'text-orange-600',
            bgColor: darkMode ? 'bg-orange-900/20' : 'bg-orange-50',
            borderColor: darkMode ? 'border-orange-800' : 'border-orange-200'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${stat.bgColor} ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs md:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-xl md:text-2xl font-bold mt-1 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Low Stock Warning Banner */}
      {stats.lowStock > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg ${
            darkMode 
              ? 'bg-orange-900/30 border-orange-800' 
              : 'bg-orange-100 border-orange-200'
          } border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className={`text-lg ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            <div>
              <p className={`font-medium ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                Low Stock Alert!
              </p>
              <p className={`text-sm ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                {stats.lowStock} product{stats.lowStock !== 1 ? 's' : ''} have less than 10 units in stock
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10);
              alert(`⚠️ LOW STOCK PRODUCTS:\n\n${lowStockProducts.map(p => `${p.name}: ${p.stock} units`).join('\n')}`);
            }}
            className={`px-3 py-1 rounded text-sm w-full sm:w-auto ${
              darkMode 
                ? 'bg-orange-800 text-orange-300 hover:bg-orange-700' 
                : 'bg-orange-200 text-orange-700 hover:bg-orange-300'
            }`}
          >
            View Details
          </button>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border`}>
          <div className="flex items-start justify-between">
            <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
            <button 
              onClick={() => setError('')}
              className={`text-sm ml-4 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className={`w-full rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl overflow-hidden`}>
        <ProductTable
          products={products}
          darkMode={darkMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFeatured={handleToggleFeatured}
          onToggleBestSeller={handleToggleBestSeller}
          onQuickStockUpdate={handleQuickStockUpdate}
          selectedProducts={selectedProducts}
          onSelectProduct={handleSelectProduct}
          onSelectAll={handleSelectAll}
        />
      </div>

      {/* Bulk Actions Footer */}
      {selectedProducts.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-auto p-4 rounded-xl shadow-2xl ${
            darkMode 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-200'
          } border z-50`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-green-500' : 'bg-green-600'}`}></div>
              <span className={`font-medium text-sm md:text-base ${darkMode ? 'text-white' : 'text-black'}`}>
                {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkDelete}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base ${
                  darkMode 
                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                } transition active:scale-95`}
              >
                <FaTrash />
                <span className="hidden xs:inline">Delete</span>
              </button>
              <button
                onClick={() => setSelectedProducts([])}
                className={`px-3 py-2 rounded-lg text-sm md:text-base ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-black'
                } transition active:scale-95`}
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-3 py-6 z-[100]">
          <div className={`w-full max-w-full md:max-w-4xl max-h-[90vh] md:max-h-[95vh] overflow-y-auto rounded-xl md:rounded-2xl ${
            darkMode ? 'bg-gray-900' : 'bg-white'
          } shadow-2xl`}>
            <ProductForm
              darkMode={darkMode}
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;