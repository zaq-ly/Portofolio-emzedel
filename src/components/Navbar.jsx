import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 bg-dark/80 backdrop-blur-xl shadow-lg shadow-dark/50 border-b border-dark-border'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#home" className="font-display text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          MZL
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-400 hover:text-white font-medium transition-colors duration-300 text-sm tracking-wide"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-dark-card transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: isDarkMode ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center space-x-3">
          <button onClick={toggleDarkMode} className="p-2 text-gray-400 hover:text-white">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-400 hover:text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 w-full bg-dark/95 backdrop-blur-xl border-t border-dark-border shadow-xl"
          >
            <div className="py-6 px-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg text-gray-400 hover:text-white font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
