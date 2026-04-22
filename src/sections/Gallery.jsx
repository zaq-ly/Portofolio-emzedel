import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'branding', label: 'Branding' },
  { key: 'illustration', label: 'Illustration' },
  { key: 'social-media', label: 'Social Media' },
  { key: 'print', label: 'Print' },
  { key: 'ui-ux', label: 'UI/UX' },
];

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
            A curated selection of my design projects. Each piece reflects my commitment to quality, creativity, and visual storytelling.
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
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.key
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-gray-400 hover:text-white hover:bg-dark-card border border-dark-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                layout
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <a
            href="https://github.com/zaq-ly"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-primary font-bold hover:underline group"
          >
            <span>View all projects</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
