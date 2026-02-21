// src/components/common/Toast.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FaCheckCircle className="text-green-500 text-xl" />,
    error: <FaExclamationCircle className="text-red-500 text-xl" />,
    info: <FaInfoCircle className="text-blue-500 text-xl" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-xl border ${colors[type]} max-w-md`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-auto">
          <FaTimes className="opacity-50 hover:opacity-100" />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;