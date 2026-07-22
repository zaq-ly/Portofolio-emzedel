import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '../components/animations/FadeIn';
import { Typewriter } from '../components/animations/Typewriter';

const Hero = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    currentTarget.style.setProperty('--mouse-x', `${clientX - left}px`);
    currentTarget.style.setProperty('--mouse-y', `${clientY - top}px`);
  };

  return (
    <section 
      id="home" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-background pt-20"
    >
      {/* --- PROFESSIONAL ACCENT (MODERN DOT GRID) --- */}
      <div 
        className="absolute inset-0 z-0 opacity-40 dark:opacity-40 pointer-events-none transition-opacity duration-500"
        style={{ 
          backgroundImage: 'radial-gradient(circle at center, currentColor 1.5px, transparent 1.5px)', 
          backgroundSize: '32px 32px',
          WebkitMaskImage: 'radial-gradient(circle 500px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)',
          maskImage: 'radial-gradient(circle 500px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)'
        }} 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full h-full flex flex-col items-center justify-center z-10 relative">
        
        {/* CENTER COLUMN (TEXT) */}
        <motion.div 
          style={{ y: yText }}
          className="flex flex-col items-center text-center z-20 w-full"
        >
 
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.3,
                }
              }
            }}
            className="flex flex-col text-[2.5rem] sm:text-[4rem] md:text-6xl lg:text-7xl xl:text-[5.5rem] font-black tracking-tighter text-text-primary leading-[0.9] mb-8 drop-shadow-sm w-full max-w-4xl mx-auto"
          >
            <motion.span 
              variants={{
                hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", damping: 12, stiffness: 100 } }
              }}
              className="text-left w-full pr-12 md:pr-0 inline-block"
            >
              MUHAMMAD
            </motion.span>
            <motion.span 
              variants={{
                hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", damping: 12, stiffness: 100 } }
              }}
              className="text-center w-full opacity-80 inline-block"
              style={{ WebkitTextStroke: '3px currentColor', WebkitTextFillColor: 'transparent' }}
            >
              ZAQLY
            </motion.span>
            <motion.span 
              variants={{
                hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", damping: 12, stiffness: 100 } }
              }}
              className="text-right w-full text-text-secondary pl-12 md:pl-0 inline-block"
            >
              LULUANG.
            </motion.span>
          </motion.h1>
          
          <FadeIn delay={0.6} direction="up" distance={20} className="mb-6 w-full flex justify-center">
            {/* Removed the background wrapper, kept a clean subtle border-bottom for Apple aesthetics */}
            <div className="inline-block border-b border-border/40 pb-2">
              <Typewriter 
                text="Creative Developer. Design & Code." 
                delay={1} 
                speed={60} 
                className="text-xs md:text-sm lg:text-base font-bold text-text-secondary tracking-[0.2em] uppercase leading-relaxed"
              />
            </div>
          </FadeIn>
          
          <FadeIn delay={0.8} direction="up" distance={20} className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <a href="#projects" className="relative z-30 w-full sm:w-auto px-8 py-3.5 bg-text-primary text-surface rounded-full text-xs lg:text-sm font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 text-center">
                Lihat Projects
              </a>
              <a href="#contact" className="relative z-30 w-full sm:w-auto px-8 py-3.5 border-2 border-text-primary text-text-primary rounded-full text-xs lg:text-sm font-bold hover:bg-text-primary hover:text-surface transition-all duration-300 text-center shadow-lg bg-background/50 backdrop-blur-sm">
                Hubungi Saya
              </a>
            </div>
          </FadeIn>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
