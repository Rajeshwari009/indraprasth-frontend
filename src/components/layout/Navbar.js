import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Sun, Moon, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import BrandLogo from '../common/BrandLogo';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Only use transparent style on home page at the very top
  const isHome = pathname === '/';
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop Now' },
    { to: '/bulk-orders', label: 'Bulk Orders' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const inactiveLink = isTransparent
    ? 'text-white/90 hover:text-white hover:bg-white/15'
    : 'text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20';

  const activeLink = isTransparent
    ? 'text-white bg-white/20 font-semibold'
    : 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent
        ? 'bg-transparent'
        : 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-md dark:shadow-gray-900/50'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="group">
            <BrandLogo
              className="h-11 md:h-12 w-auto"
              showText={false}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? activeLink : inactiveLink}`
                }
              >{link.label}</NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all ${isTransparent ? 'text-white/90 hover:bg-white/15' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link to="/cart"
              className={`relative p-2 rounded-xl transition-all ${isTransparent ? 'text-white/90 hover:bg-white/15' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(p => !p)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${isTransparent ? 'hover:bg-white/15' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`hidden sm:block text-sm font-medium transition-colors ${isTransparent ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`transition-all ${userMenuOpen ? 'rotate-180' : ''} ${isTransparent ? 'text-white/70' : 'text-gray-500'}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900 border border-gray-100 dark:border-gray-700 py-2 z-50">
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
                          <Settings size={16} /> Admin Panel
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
                        <User size={16} /> My Profile
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login"
                className={`text-sm font-semibold py-2 px-4 rounded-xl transition-all ${isTransparent ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-md' : 'btn-primary'}`}>
                Login
              </Link>
            )}

            <button
              className={`lg:hidden p-2 rounded-xl transition-all ${isTransparent ? 'text-white hover:bg-white/15' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setMenuOpen(p => !p)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden">
              <div className={`py-4 space-y-1 border-t ${isTransparent ? 'border-white/20 bg-blue-900/80 backdrop-blur-md' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950'} rounded-b-2xl px-2 pb-4`}>
                {navLinks.map(link => (
                  <NavLink key={link.to} to={link.to} end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? isTransparent ? 'text-white bg-white/20' : 'text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400'
                          : isTransparent ? 'text-white/90 hover:bg-white/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`
                    }
                  >{link.label}</NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
