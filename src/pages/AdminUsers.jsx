import React from 'react';

const AdminUsers = ({ darkMode }) => {
  return (
    <div>
      <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
        Users Management
      </h1>
      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
        User management page will be implemented soon.
      </p>
    </div>
  );
};

export default AdminUsers; // ← MUST HAVE THIS LINE