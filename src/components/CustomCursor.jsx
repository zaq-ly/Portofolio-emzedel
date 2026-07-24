import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Deteksi apakah perangkat menggunakan layar sentuh (mobile/tablet)
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Deteksi jika kursor berada di atas elemen yang bisa diklik
      if (
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.classList.contains('cursor-pointer') ||
        e.target.closest('.cursor-pointer') ||
        window.getComputedStyle(e.target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Jangan tampilkan custom cursor di perangkat sentuh
  if (isTouchDevice) return null;

  return (
    <>
      {/* Sembunyikan kursor bawaan sistem */}
      <style>{`
        @media (pointer: fine) {
          *, *::before, *::after {
            cursor: none !important;
          }
        }
      `}</style>
      
      {/* Cursor Tunggal yang Simpel dan Minimalis */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-transparent backdrop-invert rounded-full pointer-events-none z-[10000]"
        animate={{
          x: mousePosition.x - 8, // offset = setengah dari width/height (16px / 2)
          y: mousePosition.y - 8,
          scale: isHovering ? 2.5 : 1, // Membesar halus saat ada objek yg bisa diklik
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
    </>
  );
};

export default CustomCursor;
