// src/components/common/ConfirmModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes, FaCheck } from 'react-icons/fa';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6"
        >
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
              <FaExclamationTriangle className="text-3xl text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <FaTimes className="inline mr-2" />
              No, Keep It
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              <FaCheck className="inline mr-2" />
              Yes, Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModal;