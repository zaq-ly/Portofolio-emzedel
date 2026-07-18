import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Code2, Palette, Layout } from 'lucide-react';

const Hero = () => {
  const pillars = [
    { icon: <Code2 size={16} />, label: 'Front-End Dev' },
    { icon: <Layout size={16} />, label: 'UI/UX Design' },
    { icon: <Palette size={16} />, label: 'Design & Ilustrasi' },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-dot-pattern" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/[0.02] rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
        {/* Left — Text */}
        <div className="lg:w-3/5 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Terbuka untuk peluang baru
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-4 text-text-primary"
          >
            <span className="block text-lg md:text-xl font-sans font-medium text-text-secondary mb-3">
              Hai, saya
            </span>
            Muhammad Zaqly{' '}
            <span className="text-accent">Luluang</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base md:text-lg text-text-secondary mb-6 max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            <span className="font-display font-semibold text-text-primary">Creative Developer</span> — Saya mendesain, mengilustrasikan, dan membangun pengalaman digital dari konsep hingga production code.
          </motion.p>

          {/* Pillar badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8"
          >
            {pillars.map((pillar, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg
                           bg-surface border border-border text-text-secondary
                           hover:border-accent/30 hover:text-accent hover:bg-accent/[0.03]
                           transition-all duration-200"
              >
                {pillar.icon}
                {pillar.label}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3"
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white
                         font-medium text-sm rounded-xl hover:bg-primary/90
                         transition-all duration-200 shadow-soft hover:shadow-card"
            >
              Lihat Projects
              <ArrowRight size={16} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface text-text-primary
                         font-medium text-sm rounded-xl border border-border
                         hover:border-border-hover hover:bg-surface-secondary
                         transition-all duration-200"
            >
              Hubungi Saya
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-12 flex items-center justify-center lg:justify-start gap-8"
          >
            {[
              { value: '80+', label: 'Karya Desain' },
              { value: '3', label: 'Bidang Keahlian' },
              { value: '∞', label: 'Semangat Belajar' },
            ].map((stat, i) => (
              <div key={i} className="text-center lg:text-left">
                <span className="block text-2xl font-display font-bold text-text-primary">{stat.value}</span>
                <span className="block text-xs text-text-tertiary">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-2/5 relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-full h-full bg-accent/5 rounded-3xl" />
          <div className="absolute -top-3 -right-3 w-full h-full bg-accent/[0.08] rounded-3xl" />

          {/* Main image */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto rounded-3xl overflow-hidden shadow-elevated border border-border">
            <img
              src="/gallery/foto_profil.JPG"
              alt="Muhammad Zaqly Luluang"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute -bottom-4 -left-4 md:left-0 bg-surface border border-border rounded-2xl p-4 shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Code2 size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">Creative Developer</p>
                <p className="text-[10px] text-text-tertiary">Design → Code Pipeline</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
