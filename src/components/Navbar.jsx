import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Library, Home, Sun, Moon, Coffee, Sparkles, User, LogOut, LogIn, UserPlus, Feather } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [theme, setTheme] = useState('light');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const themes = ['light', 'sepia', 'night'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} />;
      case 'sepia':
        return <Coffee size={20} />;
      case 'night':
        return <Moon size={20} />;
      default:
        return <Sun size={20} />;
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass sticky top-0 z-50"
      style={{
        borderBottom: '1px solid var(--color-border-light)',
      }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <BookOpen
                size={32}
                style={{ color: 'var(--color-accent-primary)' }}
              />
              <h1
                className="text-3xl font-playfair font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Novelle
              </h1>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 animated-underline"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <Home size={18} />
                <span className="font-inter font-medium">Home</span>
              </motion.div>
            </Link>

            <Link to="/discover">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 animated-underline"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <Sparkles size={18} />
                <span className="font-inter font-medium">Discover</span>
              </motion.div>
            </Link>

            {isAuthenticated && (
              <Link to="/create">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 animated-underline"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Feather size={18} />
                  <span className="font-inter font-medium">Share Quote</span>
                </motion.div>
              </Link>
            )}

            <Link to="/library">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 animated-underline"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <Library size={18} />
                <span className="font-inter font-medium">Library</span>
              </motion.div>
            </Link>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-accent-primary)',
              }}
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </motion.button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border-light)'
                  }}
                >
                  <User size={18} />
                  <span className="font-inter font-medium">{user?.username || user?.name}</span>
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 glass rounded-lg shadow-lg overflow-hidden"
                      style={{ border: '1px solid var(--color-border-light)' }}
                    >
                      <div className="p-3 border-b" style={{ borderColor: 'var(--color-border-light)' }}>
                        <p className="font-inter font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                          {user?.name || user?.username}
                        </p>
                        <p className="font-inter text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          {user?.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/profile');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 font-inter hover:opacity-80 transition-opacity"
                        style={{
                          color: 'var(--color-text-primary)',
                          backgroundColor: 'transparent'
                        }}
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 font-inter hover:opacity-80 transition-opacity"
                        style={{
                          color: 'var(--color-text-primary)',
                          backgroundColor: 'transparent'
                        }}
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-inter font-medium"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-light)'
                    }}
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-inter font-medium"
                    style={{
                      backgroundColor: 'var(--color-accent-primary)',
                      color: 'white'
                    }}
                  >
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
