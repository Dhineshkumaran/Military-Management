import React, { useState } from 'react';
import { Menu, X, User, LogOut, Home, ShoppingCart, ArrowLeftRight, ClipboardList, DollarSign, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({currentPath = '/', onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, logout } = useAuth();
  const user = auth?.user;
  const isAdmin = user?.role_id === 1;

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    handleNavigation('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (currentPath === '/') {
    return null;
  }

  const navItems = [
    ...(isAdmin ? [{ path: '/dashboard', label: 'Dashboard', icon: Home }] : []),
    { path: '/purchases', label: 'Purchases', icon: ShoppingCart },
    { path: '/transfers', label: 'Transfers', icon: ArrowLeftRight },
    { path: '/assignments', label: 'Assignments', icon: ClipboardList },
    { path: '/expenditures', label: 'Expenditures', icon: DollarSign },
    ...(isAdmin ? [{ path: '/signup', label: 'Add User', icon: UserPlus }] : []),
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavigation('/dashboard')}>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                MAMS
              </span>
            </div>
          </div>


          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>


          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <span>{user?.name || 'User'}</span>
              {isAdmin && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>


          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>


      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
            

            <div className="pt-4 pb-3 border-t border-gray-300">
              <div className="flex items-center px-3 mb-3">
                <User className="w-5 h-5 mr-3 text-gray-600" />
                <div className="flex flex-col">
                  <span className="text-base font-medium text-gray-900">
                    {user?.name || 'User'}
                  </span>
                  {isAdmin && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1 w-fit">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;