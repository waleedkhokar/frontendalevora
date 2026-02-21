import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

const AdminLayout = ({ darkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 p-4 ${darkMode ? 'bg-gray-900 border-b border-gray-800' : 'bg-white border-b border-gray-200'
        }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg ${darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition`}
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <div>
              <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                Admin Panel
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                JavaScript Hoodies
              </p>
            </div>
          </div>

          <div className={`text-sm px-3 py-1 rounded-full ${darkMode
              ? 'bg-yellow-900/30 text-yellow-400'
              : 'bg-yellow-100 text-yellow-700'
            }`}>
            Admin
          </div>
        </div>
      </div>

      <div className="flex pt-16 lg:pt-0">
        {/* Sidebar */}
        <AdminSidebar
          darkMode={darkMode}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Content */}
       <main className={`flex-1 transition-all duration-300 w-full`}>
          <div className={`min-h-screen lg:min-h-[calc(100vh)] ${darkMode ? 'bg-gray-950' : 'bg-gray-50'
            }`}>
            {/* Desktop Header */}
            <div className={`hidden lg:block sticky top-0 z-30 px-6 lg:px-8 py-4 lg:py-6 border-b ${darkMode ? 'bg-gray-900/95 border-gray-800 backdrop-blur-sm' : 'bg-white/95 border-gray-200 backdrop-blur-sm'
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className={`text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                    Admin Dashboard
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Welcome back! Manage your store efficiently
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`hidden md:block text-sm px-3 py-1 rounded-full ${darkMode
                      ? 'bg-yellow-900/30 text-yellow-400'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    Super Admin
                  </div>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-4 lg:p-6 xl:p-8">
              <div className={`rounded-xl lg:rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'
                } shadow-lg lg:shadow-xl`}>
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Bottom Navigation Hint */}
      {isMobile && !isMobileMenuOpen && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm ${darkMode
            ? 'bg-gray-900/90 text-gray-300 border border-gray-800'
            : 'bg-white/90 text-gray-700 border border-gray-200'
          } backdrop-blur-sm shadow-lg`}>
          👈 Swipe or tap menu to navigate
        </div>
      )}
    </div>
  );
};

export default AdminLayout;