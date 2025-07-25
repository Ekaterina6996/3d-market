import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">3DPrintHub</Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span>Hello, {user.email}</span>
                {user.role === 'maker' && (
                  <Link to="/maker" className="hover:bg-blue-700 px-3 py-1 rounded transition">
                    Maker Dashboard
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <Link to="/login" className="hover:bg-blue-700 px-3 py-1 rounded transition">
                    Login
                  </Link>
                )}
                {location.pathname !== '/register' && (
                  <Link to="/register" className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded transition">
                    Register
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 3DPrintHub - School Project MVP</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;