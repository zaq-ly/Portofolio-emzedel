import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '#' },
    { name: 'Tentang', href: '#about' },
    { name: 'Galeri', href: '#gallery' },
    { name: 'Kontak', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-4 bg-white border-b-4 border-black shadow-brutal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <a
          href="/"
          className="font-display text-2xl md:text-3xl font-black text-black"
        >
          EMZEDEL
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="border-4 border-black bg-white px-5 py-2 font-black text-sm uppercase tracking-wider shadow-brutal-sm hover:bg-secondary hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="border-4 border-black bg-white p-2 font-black shadow-brutal-sm hover:bg-secondary hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-200"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-4 border-black">
            <div className="py-4 px-4 flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="border-4 border-black bg-white px-6 py-3 font-black text-lg uppercase tracking-wider shadow-brutal-sm hover:bg-secondary hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
