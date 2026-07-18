import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { categories, projects as staticProjects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import ImageModal from '../components/ImageModal';
import { fetchProjects } from '../lib/projectsService';
import { transformProjectForGallery } from '../utils/projects';

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProjects();
        if (data && data.length > 0) {
          setDbProjects(data.map(transformProjectForGallery));
        } else {
          setDbProjects(staticProjects.map(p => transformProjectForGallery({
            ...p,
            image_url: p.image,
          })));
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setDbProjects(staticProjects.map(p => transformProjectForGallery({
          ...p,
          image_url: p.image,
        })));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProjects = activeCategory === 'all'
    ? dbProjects
    : activeCategory === 'poster-banner'
      ? dbProjects.filter(p => p.category === 'poster' || p.category === 'banner')
      : dbProjects.filter(p => p.category === activeCategory);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <section id="projects" className="section-padding bg-surface">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-label">Projects</span>
          <h2 className="section-title mb-4">
            Karya & <span className="text-accent">Project</span> Saya
          </h2>
          <p className="section-subtitle mx-auto">
            Dari ilustrasi digital, logo branding, hingga website — semua karya saya ada di sini.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                activeCategory === cat.key
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-surface-secondary text-text-secondary border border-border hover:border-border-hover hover:text-text-primary'
              }`}
            >
              {cat.label}
              {activeCategory === cat.key && (
                <span className="ml-1.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
                  {filteredProjects.length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[300px]">
          {loading && dbProjects.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-accent mb-4" size={32} />
              <p className="text-sm text-text-secondary">Memuat projects...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    layout: { duration: 0.3 }
                  }}
                >
                  <ProjectCard
                    project={project}
                    onClick={() => handleOpenModal(project)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Count info */}
        {!loading && (
          <p className="text-center text-text-tertiary text-xs mt-10">
            Menampilkan {filteredProjects.length} dari {dbProjects.length} karya
          </p>
        )}
      </div>

      {/* Lightbox Modal */}
      <ImageModal
        isOpen={isModalOpen}
        project={selectedProject}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Projects;
