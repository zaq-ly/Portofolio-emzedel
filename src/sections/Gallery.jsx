import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { categories, projects as staticProjects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import ImageModal from '../components/ImageModal';
import { subscribeProjects } from '../lib/projectsService';
import { transformProjectForGallery } from '../utils/projects';
import { db } from '../lib/firebaseClient';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      const fallback = staticProjects.map(p => transformProjectForGallery({
        ...p,
        image_url: p.image,
      }));
      setDbProjects(fallback);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeProjects(
      (data) => {
        if (data.length > 0) {
          setDbProjects(data.map(transformProjectForGallery));
        } else {
          const fallback = staticProjects.map(p => transformProjectForGallery({
            ...p,
            image_url: p.image,
          }));
          setDbProjects(fallback);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching projects:', err);
        const fallback = staticProjects.map(p => transformProjectForGallery({
          ...p,
          image_url: p.image,
        }));
        setDbProjects(fallback);
        setLoading(false);
      },
    );

    return unsubscribe;
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
    <section id="gallery" className="relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="bg-primary text-white inline-block px-6 py-3 font-black text-sm uppercase tracking-[0.2em] mb-6 border-4 border-black shadow-brutal">
            Portofolio Saya
          </h3>
          <h2 className="text-3xl md:text-5xl font-black text-black mb-6">
            Karya Desain Pilihan
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto font-bold">
            Koleksi karya desain grafis saya — dari ilustrasi digital, logo branding sampai vector & etc.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-6 py-3 border-4 border-black font-black text-sm uppercase tracking-wider transition-all duration-200 ${activeCategory === cat.key
                  ? 'bg-secondary text-black shadow-brutal translate-x-[-2px] translate-y-[-2px]'
                  : 'bg-white text-black hover:bg-light-gray hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal'
                }`}
            >
              {cat.label}
              {activeCategory === cat.key && (
                <span className="ml-2 text-xs bg-black text-white px-2 py-0.5">
                  {filteredProjects.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
          {loading && dbProjects.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary mb-4" size={48} />
              <p className="text-lg font-black text-black">Memuat karya terbaru...</p>
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
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
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
        <p className="text-center text-black text-sm mt-12 font-black">
          Menampilkan {filteredProjects.length} karya
        </p>
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

export default Gallery;
