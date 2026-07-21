import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    // Hide if scrolling down past 100px, show if scrolling up
    if (latest > previous && latest > 100) {
      setIsHidden(true);
      setIsOpen(false);
    } else if (latest < previous) {
      setIsHidden(false);
    }

    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      <motion.nav 
        initial={false}
        animate={{
          width: isScrolled ? "90%" : "100%",
          maxWidth: isScrolled ? "800px" : "100%",
          borderRadius: isOpen ? "24px" : (isScrolled ? "999px" : "0px"),
          y: isHidden ? -150 : (isScrolled ? 16 : 0),
          border: isScrolled ? "1px solid rgba(0,0,0,0.08)" : "0px solid transparent",
          boxShadow: isScrolled ? "0 20px 40px -10px rgba(0,0,0,0.1)" : "0 0px 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto bg-white/70 backdrop-blur-xl ${!isScrolled ? 'border-b border-border/50' : ''}`}
      >
        <div className="w-full px-6 h-14 flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="text-sm font-semibold tracking-tight text-text-primary hover:opacity-70 transition-opacity"
          >
            MZL.
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-primary"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 px-6 flex flex-col gap-4 border-t border-border/50">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-semibold text-text-secondary hover:text-text-primary transition-colors py-2"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navbar;
