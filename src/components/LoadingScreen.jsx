import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    // Simulasi waktu loading
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="min-h-screen w-full bg-white text-black flex flex-col items-center justify-center overflow-hidden relative"
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100vh", 
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } 
      }}
    >
      <style>
        {`
          @keyframes grain {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-5%, -10%); }
            20% { transform: translate(-15%, 5%); }
            30% { transform: translate(7%, -25%); }
            40% { transform: translate(-5%, 25%); }
            50% { transform: translate(-15%, 10%); }
            60% { transform: translate(15%, 0%); }
            70% { transform: translate(0%, 15%); }
            80% { transform: translate(3%, 35%); }
            90% { transform: translate(-10%, 10%); }
          }
        `}
      </style>
      
      {/* Animated Subtle Grain Overlay */}
      <div 
        className="absolute z-0 pointer-events-none opacity-[0.25]" 
        style={{
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          animation: "grain 8s steps(10) infinite"
        }}
      />

      <div className="flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-sm md:text-base font-medium tracking-[0.2em] text-text-secondary mb-3 md:mb-4"
        >
          Selamat Datang
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="text-xl sm:text-3xl md:text-5xl text-text-primary flex flex-wrap justify-center gap-2 md:gap-3"
        >
          <span className="font-bold">MZL</span>
          <span className="font-extralight tracking-wide">Portofolio</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
