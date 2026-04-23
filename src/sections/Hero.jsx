import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 pb-20 px-4 sm:px-6 overflow-hidden bg-white dark:bg-dark transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e1e2e_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between relative z-10">
        {/* Left — Text */}
        <div className="md:w-1/2 text-center md:text-left mb-16 md:mb-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4 inline-block px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              Desainer Grafis &amp; Seniman Visual
            </h2>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold leading-[1.1] mb-6 text-dark dark:text-white"
          >
            Mempersembahkan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Seni Visual
            </span>{' '}
            Tanpa Batas
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed"
          >
            Halo! Saya <span className="text-dark dark:text-white font-semibold">Muhammad Zaqly Luluang</span>. Saya membantu brand dan individu menceritakan kisah mereka melalui desain identitas, ilustrasi digital, dan karya seni visual yang ikonik.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <a
              href="#/#gallery"
              className="bg-primary hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Lihat Galeri Karya
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a
              href="#/#contact"
              className="group border-2 border-gray-200 dark:border-dark-border text-dark dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-dark-card hover:border-primary/50 transition-all duration-300 flex items-center justify-center"
            >
              Hubungi Saya
            </a>

          </motion.div>

          {/* Social Proof / Trust Mini Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 flex items-center justify-center md:justify-start space-x-6 text-gray-400 dark:text-gray-500"
          >
            <div className="flex flex-col">
              <span className="text-dark dark:text-white font-bold text-xl leading-none">80+</span>
              <span className="text-[10px] uppercase tracking-widest mt-1">Karya Seni</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-dark-border"></div>
            <div className="flex flex-col">
              <span className="text-dark dark:text-white font-bold text-xl leading-none">100%</span>
              <span className="text-[10px] uppercase tracking-widest mt-1">Kreatif</span>
            </div>
          </motion.div>
        </div>

        {/* Right — Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="md:w-5/12 relative"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto relative z-10"
          >
            {/* Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-3xl rotate-6 opacity-30 blur-2xl animate-glow"></div>
            {/* Profile Image */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden border-4 border-white dark:border-dark-card shadow-2xl group bg-gray-100 dark:bg-dark-card">
              <img
                src="/gallery/foto_profil.JPG"
                alt="Muhammad Zaqly Luluang"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <span className="text-white text-xs font-bold tracking-widest uppercase bg-primary/80 backdrop-blur-md px-3 py-1 rounded-full">
                  Muhammad Zaqly
                </span>
              </div>
            </div>
          </motion.div>
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/10 dark:bg-primary/20 rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-accent/10 dark:bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 top-1/4 z-20 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border border-gray-100 dark:border-dark-border p-3 rounded-2xl shadow-xl hidden lg:block"
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-dark dark:text-white font-bold uppercase tracking-wider">Tersedia untuk bekerja</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
