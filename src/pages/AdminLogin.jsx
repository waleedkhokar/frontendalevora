import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLock, FaUser, FaEye, FaEyeSlash, FaShieldAlt, 
  FaCheckCircle, FaExclamationTriangle, FaArrowRight,
  FaEnvelope, FaKey
} from 'react-icons/fa';

const AdminLogin = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Success animation
        setLoginSuccess(true);
        
        // Store token
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', data.admin.email);
        
        // Redirect after animation
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        // Shake animation for error
        document.querySelector('form').classList.add('shake-animation');
        setTimeout(() => {
          document.querySelector('form').classList.remove('shake-animation');
        }, 500);
        
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${darkMode ? 'bg-yellow-500/10' : 'bg-gray-400/20'} rounded-full`}
            style={{
              width: Math.random() * 20 + 5,
              height: Math.random() * 20 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{ duration: 1.5 }}
                className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FaCheckCircle className="text-white text-6xl" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Access Granted!</h2>
              <p className="text-gray-300">Redirecting to Admin Dashboard...</p>
              <motion.div
                className="mt-8 w-64 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md relative z-10 ${darkMode ? 'bg-gray-900/80 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'} rounded-2xl shadow-2xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'} overflow-hidden`}
      >
        {/* Header with Gradient */}
        <div className={`relative h-32 ${darkMode ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20' : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className={`p-4 rounded-full ${darkMode ? 'bg-gradient-to-r from-yellow-600 to-orange-600' : 'bg-gradient-to-r from-yellow-500 to-orange-500'}`}
            >
              <FaShieldAlt className="text-white text-3xl" />
            </motion.div>
          </div>
        </div>

        <div className="p-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Admin Portal
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              JavaScript Hoodies • Restricted Access
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className={`p-4 rounded-lg border-l-4 border-red-500 ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-3">
                    <FaExclamationTriangle className="text-red-500 text-xl" />
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                        Authentication Failed
                      </p>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-red-300' : 'text-red-500'}`}>
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FaEnvelope className="inline mr-2" />
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@javascript.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${darkMode 
                    ? 'bg-gray-800/50 border-gray-700 text-white focus:border-yellow-500' 
                    : 'bg-white border-gray-300 text-black focus:border-yellow-500'
                  } focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-all`}
                  required
                />
                <FaUser className={`absolute left-4 top-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <FaKey className="inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 rounded-lg border ${darkMode 
                    ? 'bg-gray-800/50 border-gray-700 text-white focus:border-yellow-500' 
                    : 'bg-white border-gray-300 text-black focus:border-yellow-500'
                  } focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-all`}
                  required
                />
                <FaLock className={`absolute left-4 top-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-4 ${darkMode ? 'text-gray-400 hover:text-yellow-500' : 'text-gray-500 hover:text-yellow-600'}`}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 ${loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : darkMode 
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-black hover:shadow-lg hover:shadow-yellow-500/25' 
                    : 'bg-gradient-to-r from-black to-gray-800 text-white hover:shadow-lg'
                } transition-all duration-300 relative overflow-hidden group`}
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <FaLock />
                    <span>Secure Login</span>
                    <FaArrowRight className="ml-auto" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-100 border border-gray-200'}`}
          >
            <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <strong>Demo Credentials:</strong><br />
              Email: waleedkhokharbusiness@gmail.com<br />
              Password: wktwo
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className={`px-8 py-4 border-t ${darkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-600'}`}>
          <p className="text-xs text-center">
            ⚠️ Unauthorized access is strictly prohibited
          </p>
        </div>
      </motion.div>
      
      {/* Add CSS for shake animation */}
  
    </div>
  );
};

export default AdminLogin;