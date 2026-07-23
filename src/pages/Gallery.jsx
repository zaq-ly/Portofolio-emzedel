import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import ImageModal from '../components/ImageModal';
import { fetchProjects } from '../lib/projectsService';
import { transformProjectForGallery } from '../utils/projects';
import { FadeIn } from '../components/animations/FadeIn';
import Footer from '../components/Footer';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      try {
        const data = await fetchProjects();
        if (data && data.length > 0) {
          setDbProjects(data.map(transformProjectForGallery));
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const itCategories = ['frontend', 'uiux'];
  
  // Design Projects & Categories
  const designCategoriesList = categories.filter(c => !itCategories.includes(c.key) && c.key !== 'certificate');
  const allDesignProjects = dbProjects.filter(p => !itCategories.includes(p.category) && p.category !== 'certificate');

  const filteredProjects = activeCategory === 'all'
    ? allDesignProjects
    : activeCategory === 'poster-banner'
      ? allDesignProjects.filter(p => p.category === 'poster' || p.category === 'banner')
      : allDesignProjects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <main className="flex-grow pt-24 pb-24">
        {/* Sticky Premium Back Button */}
        <div className="fixed top-8 left-4 sm:left-8 z-50">
          <button 
            onClick={() => navigate('/#visual-arts')}
            className="group flex items-center gap-3 px-5 py-3 bg-text-primary text-surface rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:scale-105 transition-all duration-300 font-bold text-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline">Kembali ke Halaman Utama</span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary mb-4">
                Galeri Karya.
              </h1>
              <p className="text-lg text-text-secondary font-medium max-w-2xl mx-auto">
                Eksplorasi visual dari berbagai project ilustrasi, logo, dan desain grafis yang pernah saya buat.
              </p>
            </FadeIn>
          </div>

          <FadeIn direction="up" delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {designCategoriesList.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all ${
                    activeCategory === cat.key
                      ? 'bg-text-primary text-white shadow-md'
                      : 'bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface border border-border/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </FadeIn>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-surface-secondary rounded-3xl aspect-square animate-pulse border border-border/50"></div>
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProjectCard
                      project={project}
                      onClick={() => handleOpenModal(project)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            {!loading && filteredProjects.length === 0 && (
              <div className="col-span-full text-center text-text-secondary py-20">
                Belum ada karya untuk kategori ini.
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <ImageModal
        isOpen={isModalOpen}
        project={selectedProject}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Gallery;
