// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ darkMode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;