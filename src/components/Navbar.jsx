import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { StaggeredMenu } from './animations/StaggeredMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollY } = useScroll();

  React.useEffect(() => {
    const handleModal = (e) => setIsModalOpen(e.detail.isOpen);
    window.addEventListener('modalStateChange', handleModal);
    return () => window.removeEventListener('modalStateChange', handleModal);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    // Hide if scrolling down past 100px, show if scrolling up (only if menu is closed)
    if (latest > previous && latest > 100) {
      if (!isOpen) setIsHidden(true);
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
    { name: 'Beranda', href: '#home' },
    { name: 'Tentang', href: '#about' },
    { name: 'Keahlian', href: '#skills' },
    { name: 'Proyek', href: '#projects' },
    { name: 'Pengalaman', href: '#experience' },
    { name: 'Sertifikat', href: '#certificates' },
    { name: 'Kontak', href: '#contact' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-[120] flex justify-center pointer-events-none">
      {/* --- DESKTOP NAVBAR --- */}
      <motion.nav 
        initial={false}
        animate={{
          width: isScrolled ? "90%" : "100%",
          maxWidth: isScrolled ? "800px" : "100%",
          borderRadius: isScrolled ? "999px" : "0px",
          y: (isHidden || isModalOpen) ? -150 : (isScrolled ? 16 : 0),
          border: isScrolled ? "1px solid rgba(0,0,0,0.08)" : "0px solid transparent",
          boxShadow: isScrolled ? "0 20px 40px -10px rgba(0,0,0,0.1)" : "0 0px 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`hidden md:flex pointer-events-auto bg-white/70 backdrop-blur-xl ${!isScrolled ? 'border-b border-border/50' : ''}`}
      >
        <div className="w-full px-6 h-14 flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={() => { window.location.href = '/'; }} 
            className="text-sm font-semibold tracking-tight text-text-primary hover:opacity-70 transition-opacity"
          >
            MZL.
          </button>

          {/* Desktop Nav */}
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-text-secondary hover:text-text-primary hover:-translate-y-0.5 transition-all duration-300 inline-block"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* --- MOBILE NAVBAR (SPLIT PILLS) --- */}
      <div className="md:hidden flex w-full justify-between items-start px-4 pt-4 pointer-events-none">
        {/* Left Pill (Logo) */}
        <motion.div
          animate={{
            y: (isHidden || isModalOpen) ? -150 : 0,
            opacity: isOpen ? 0 : 1,
            pointerEvents: isOpen ? 'none' : 'auto',
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto bg-white/70 backdrop-blur-xl rounded-full px-5 h-12 flex items-center justify-center shadow-[0_8px_32px_-10px_rgba(0,0,0,0.1)] border border-black/5"
        >
          <button 
            onClick={() => { window.location.href = '/'; }} 
            className="text-sm font-semibold tracking-tight text-text-primary"
          >
            MZL.
          </button>
        </motion.div>

        {/* Right Pill (Menu Toggle) */}
        <motion.div
          animate={{
            y: (isHidden || isModalOpen) ? -150 : 0,
            backgroundColor: isOpen ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.7)",
            boxShadow: isOpen ? "0 0px 0px 0px rgba(0,0,0,0)" : "0 8px 32px -10px rgba(0,0,0,0.1)",
            borderColor: isOpen ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.05)",
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto rounded-full w-12 h-12 flex items-center justify-center border ${!isOpen ? 'backdrop-blur-xl' : ''}`}
        >
          <StaggeredMenu
            position="right"
            colors={['#1a1a1c', '#35353c']}
            accentColor="#fff"
            menuButtonColor="#000"
            openMenuButtonColor="#000"
            items={navLinks.map(link => ({ label: link.name, link: link.href }))}
            displaySocials={false}
            changeMenuColorOnOpen={false}
            onMenuOpen={() => setIsOpen(true)}
            onMenuClose={() => setIsOpen(false)}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;
