import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-16 px-4 sm:px-6 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        {/* Left — Text */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="inline-block bg-secondary border-4 border-black px-6 py-3 font-black text-sm uppercase tracking-[0.2em] mb-6 shadow-brutal-sm">
              Design Lover & Visual Explorer
            </h2>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 text-black"
          >
            <span className="block text-2xl md:text-3xl mb-2 font-black">
              HAI, SAYA
            </span>
            <span className="bg-primary text-white px-6 py-3 inline-block border-4 border-black shadow-brutal">
              MUHAMMAD ZAQLY
            </span>
            <br />
            <span className="text-black">
              LULUANG
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-black mb-10 max-w-xl mx-auto lg:mx-0 font-bold leading-relaxed"
          >
            Koleksi hasil corat-coret, eksperimen visual, dan eksplorasi desain dari seseorang yang menjadikan proses kreatif sebagai hobi utama. Masih terus belajar, masih terus mencoba hal baru!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
          >
            <a
              href="#gallery"
              className="bg-primary text-white border-4 border-black px-8 py-4 font-black text-lg shadow-brutal hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal-lg active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all duration-200 flex items-center justify-center gap-2"
            >
              Lihat Galeri
              <ArrowRight size={24} />
            </a>
            <a
              href="#contact"
              className="bg-white text-black border-4 border-black px-8 py-4 font-black text-lg shadow-brutal hover:bg-secondary hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal-lg active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all duration-200 flex items-center justify-center"
            >
              Hubungi Saya
            </a>
          </motion.div>

          {/* Social Proof / Trust Mini Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex items-center justify-center lg:justify-start gap-8"
          >
            <div className="border-4 border-black bg-light-gray px-6 py-4 shadow-brutal-sm">
              <span className="block text-3xl font-black">80+</span>
              <span className="block text-xs font-black uppercase tracking-wider">Karya Seni</span>
            </div>
            <div className="border-4 border-black bg-accent text-white px-6 py-4 shadow-brutal-sm">
              <span className="block text-3xl font-black">100%</span>
              <span className="block text-xs font-black uppercase tracking-wider">Kreatif</span>
            </div>
          </motion.div>
        </div>

        {/* Right — Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="lg:w-5/12 relative"
        >
          {/* Decorative shapes */}
          <div className="absolute -top-12 -right-8 w-24 h-24 bg-secondary border-4 border-black rounded-full shadow-brutal z-0 animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-accent border-4 border-black shadow-brutal z-20 rotate-12"></div>
          
          <div className="relative z-10">
            {/* Decorative elements behind */}
            <div className="absolute -z-10 top-6 left-6 w-full h-full bg-secondary border-4 border-black"></div>
            <div className="absolute -z-20 top-12 left-12 w-full h-full bg-primary border-4 border-black"></div>

            {/* Main image */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto border-4 border-black shadow-brutal-lg overflow-hidden bg-white">
              <img
                src="/gallery/foto_profil.JPG"
                alt="Muhammad Zaqly Luluang"
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
