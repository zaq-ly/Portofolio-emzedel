import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const skills = [
    'Adobe Illustrator', 'Figma', 'Affinity', 'Inkscape',
    'Brand Identity', 'Digital Illustration', 'Layout Design',
    'UI/UX Design', 'Photo Editing',
  ];

  const stats = [
    { value: '50+', label: 'Proyek Selesai' },
    { value: '3+', label: 'Tahun Pengalaman' },
    { value: '20+', label: 'Klien Puas' },
    { value: '100+', label: 'Desain Dibuat' },
  ];

  return (
    <section id="about" className="relative py-20 md:py-28 bg-dark-card/50 transition-colors overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#1e1e2e_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          {/* Left — Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h3 className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4">
              Tentang Saya
            </h3>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Desainer Kreatif Berbasis di Indonesia
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Saya adalah seorang desainer grafis yang berfokus pada menciptakan identitas visual yang kuat dan ilustrasi digital yang bermakna. Dengan pendekatan yang minimalis namun elegan, saya membantu mewujudkan ide-ide kreatif menjadi kenyataan yang visual.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-4 bg-dark-card rounded-xl border border-dark-border"
                >
                  <h4 className="text-2xl font-bold text-primary mb-1">{stat.value}</h4>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <h3 className="text-white font-bold text-xl mb-6">Keahlian Desain Saya</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="px-5 py-2 bg-dark rounded-full text-sm font-medium text-gray-300 border border-dark-border hover:border-primary hover:text-primary transition-all duration-300 cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border border-primary/10"
            >
              <h4 className="text-white font-bold mb-4 italic text-lg">
                "Desain bukan hanya apa yang terlihat dan terasa. Desain adalah bagaimana ia bekerja."
              </h4>
              <p className="text-gray-500 text-sm">— Steve Jobs</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
