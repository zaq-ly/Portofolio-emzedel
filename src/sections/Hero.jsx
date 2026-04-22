import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0 animate-fade-in">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
            Welcome to my portfolio
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-dark dark:text-white leading-tight mb-6">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">EMZEDEL</span>
          </h1>
          <p className="text-lg text-secondary dark:text-gray-400 mb-10 max-w-lg mx-auto md:mx-0">
            A passionate Full Stack Developer specializing in building modern, responsive, and user-centric web applications.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#projects"
              className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center group"
            >
              View My Work
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </a>
            <a
              href="#contact"
              className="border-2 border-gray-200 dark:border-gray-800 text-dark dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Contact Me
            </a>
          </div>
        </div>

        <div className="md:w-5/12 relative">
          <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto relative z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-600 rounded-3xl rotate-6 opacity-20 animate-pulse"></div>
            <img
              src="https://via.placeholder.com/400x400"
              alt="Profile"
              className="w-full h-full object-cover rounded-3xl shadow-2xl relative z-20 border-4 border-white dark:border-gray-800"
            />
          </div>
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
