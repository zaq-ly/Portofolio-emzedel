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

  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section 
      id="home" 
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background pt-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full h-full flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-8 z-10 relative">
        
        {/* LEFT COLUMN (TEXT) */}
        <motion.div 
          style={{ y: yText }}
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-20 mt-8 lg:mt-0"
        >
          <FadeIn delay={0.2} direction="up" distance={30}>
            <h2 className="text-xs md:text-sm text-text-secondary tracking-[0.3em] uppercase font-bold mb-4 ml-1">
              Halo, Saya
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.4} direction="up" distance={30}>
            <h1 className="text-[3.5rem] md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-tighter text-text-primary leading-[0.95] mb-8 drop-shadow-sm">
              MUHAMMAD<br/>
              ZAQLY<br/>
              <span className="text-text-secondary">LULUANG.</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.6} direction="up" distance={20} className="mb-12 w-full flex justify-center lg:justify-start">
            <div className="border-l-4 border-text-primary pl-5 py-1">
              <Typewriter 
                text="Creative Developer. Design & Code." 
                delay={1} 
                speed={60} 
                className="text-xs md:text-sm lg:text-base font-bold text-text-secondary tracking-[0.2em] uppercase leading-relaxed"
              />
            </div>
          </FadeIn>
          
          <FadeIn delay={0.8} direction="up" distance={20} className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
              <a href="#projects" className="w-full sm:w-auto px-8 py-3.5 bg-text-primary text-surface rounded-full text-xs lg:text-sm font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 text-center">
                Lihat Projects
              </a>
              <a href="#contact" className="w-full sm:w-auto px-8 py-3.5 border-2 border-text-primary text-text-primary rounded-full text-xs lg:text-sm font-bold hover:bg-text-primary hover:text-surface transition-all duration-300 text-center shadow-lg">
                Hubungi Saya
              </a>
            </div>
          </FadeIn>
        </motion.div>

        {/* RIGHT COLUMN (PHOTO) */}
        <motion.div 
          style={{ y: yImage }}
          className="flex-1 w-full flex items-center justify-center lg:justify-end relative h-[50vh] lg:h-[80vh] z-10"
        >
          {/* Decorative Aura / Highlight behind the photo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full blur-[80px] opacity-60 -z-10"></div>
          
          <img 
            src="/gallery/foto_profil.JPG"
            alt="Muhammad Zaqly Luluang" 
            className="w-full max-w-sm lg:max-w-2xl h-full object-contain object-bottom drop-shadow-[0_30px_50px_rgba(0,0,0,0.25)]"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
