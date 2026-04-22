import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center pt-20 pb-20 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between">
        {/* Left — Text */}
        <div className="md:w-1/2 text-center md:text-left mb-16 md:mb-0">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="text-primary font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4"
          >
            Graphic Designer &amp; Visual Artist
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold leading-tight mb-6"
          >
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Muhammad Zaqly Luluang
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-400 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed"
          >
            A passionate graphic designer specializing in brand identity, digital illustration, and visual storytelling. I transform ideas into captivating visual experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <a
              href="#gallery"
              className="bg-primary hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all duration-300 flex items-center justify-center group hover:scale-105"
            >
              View My Work
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </a>
            <a
              href="#contact"
              className="border-2 border-dark-border text-white px-8 py-4 rounded-xl font-bold hover:bg-dark-card hover:border-primary/50 transition-all duration-300"
            >
              Contact Me
            </a>
          </motion.div>
        </div>

        {/* Right — Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="md:w-5/12 relative"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto relative z-10">
            {/* Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-3xl rotate-6 opacity-20 animate-glow"></div>
            {/* Profile Image */}
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
              alt="Muhammad Zaqly Luluang"
              className="w-full h-full object-cover rounded-3xl shadow-2xl relative z-20 border-4 border-dark-card"
            />
          </div>
          {/* Decorative Blurs */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
