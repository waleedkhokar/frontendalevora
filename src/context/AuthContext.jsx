// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// ✅ EXPORT THIS
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ✅ EXPORT THIS TOO
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Your auth functions here...

  const value = {
    admin,
    loading,
    login: () => {},
    logout: () => {}
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};