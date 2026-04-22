import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { projects, categories } from '../data/projects';
import ProjectCard from '../components/ProjectCard';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="gallery" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h3 className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4">
            My Portfolio
          </h3>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            Featured Design Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Koleksi karya design grafis — dari ilustrasi digital, vektor, logo branding, hingga graffiti typography.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.key
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-dark-card border border-dark-border'
              }`}
            >
              {cat.label}
              {activeCategory === cat.key && (
                <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  {filteredProjects.length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Project Grid — 4 columns on large screens for 1:1 images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                layout
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Count info */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 text-sm mt-8"
        >
          Menampilkan {filteredProjects.length} dari {projects.length} karya
        </motion.p>
      </div>
    </section>
  );
};

export default Gallery;
