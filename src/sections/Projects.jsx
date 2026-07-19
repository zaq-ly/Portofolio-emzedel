import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { projects as staticProjects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import ITProjectCard from '../components/ITProjectCard';
import ImageModal from '../components/ImageModal';
import { fetchProjects } from '../lib/projectsService';
import { transformProjectForGallery } from '../utils/projects';
import { FadeIn } from '../components/animations/FadeIn';

const StackedITCard = ({ project, index, total, onClick }) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 20vh', 'start -60vh']
  });

  const isLast = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.95]);
  const filter = useTransform(scrollYProgress, [0, 1], ['blur(0px)', isLast ? 'blur(0px)' : 'blur(8px)']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.6]);

  return (
    <>
      <div ref={ref} className="w-full h-0 pointer-events-none invisible" />
      <div className="sticky z-10 w-full mb-12 md:mb-24" style={{ top: '20vh' }}>
        <motion.div 
          style={{ scale, opacity, filter }}
          className="w-full origin-top"
        >
          <FadeIn delay={0} direction="up" distance={40} className="w-full shadow-2xl rounded-[2rem]">
            <ITProjectCard project={project} onClick={() => onClick(project)} />
          </FadeIn>
        </motion.div>
      </div>
    </>
  );
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const itCategories = ['frontend', 'uiux'];

  // IT Projects (hanya ambil yang di-feature admin, maksimal 3)
  const itProjects = dbProjects.filter(p => itCategories.includes(p.category) && p.isFeatured).slice(0, 3);

  // Design Projects (hanya ambil yang di-feature admin, maksimal 6)
  const designProjects = dbProjects.filter(p => !itCategories.includes(p.category) && p.isFeatured).slice(0, 6);

  return (
    <section id="projects" className="section-padding bg-primary">
      <div className="max-w-6xl mx-auto">

        {/* --- IT Development Section --- */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <FadeIn direction="up">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-4">
                IT Development.
              </h2>
              <p className="text-lg text-text-secondary font-medium">
                Project website dan pengembangan front-end.
              </p>
            </FadeIn>
          </div>

          <div className="block relative pb-12">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-text-secondary" size={32} />
              </div>
            ) : itProjects.length > 0 ? (
              itProjects.map((project, index) => (
                <StackedITCard
                  key={project.id}
                  project={project}
                  index={index}
                  total={itProjects.length}
                  onClick={handleOpenModal}
                />
              ))
            ) : (
              <div className="text-center text-text-tertiary py-10">
                Belum ada project IT Development.
              </div>
            )}
          </div>

          <FadeIn direction="up" delay={0.3}>
            <div className="flex justify-center mt-12">
              <button
                onClick={() => navigate('/it-projects')}
                className="group flex items-center gap-3 px-8 py-4 bg-[#0071e3] text-white rounded-full font-bold text-sm hover:scale-105 transition-all duration-300 shadow-card hover:shadow-lg"
              >
                Lihat Semua Project IT
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </FadeIn>
        </div>

        {/* --- Visual Arts Section (Teaser) --- */}
        <div id="visual-arts" className="scroll-mt-24">
          <div className="text-center mb-16">
            <FadeIn direction="up">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-4">
                Karya Visual.
              </h2>
              <p className="text-lg text-text-secondary font-medium">
                Sedikit cuplikan dari sisi kreatif saya.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {loading ? (
              <div className="col-span-full flex justify-center py-10">
                <Loader2 className="animate-spin text-text-secondary" size={32} />
              </div>
            ) : (
              designProjects.map((project, index) => (
                <FadeIn key={project.id} delay={index * 0.1} direction="up" distance={30}>
                  <ProjectCard
                    project={project}
                    onClick={() => handleOpenModal(project)}
                  />
                </FadeIn>
              ))
            )}
          </div>

          <FadeIn direction="up" delay={0.3}>
            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate('/gallery')}
                className="group flex items-center gap-3 px-8 py-4 bg-text-primary text-white rounded-full font-bold text-sm hover:scale-105 transition-all duration-300 shadow-card hover:shadow-lg"
              >
                Lihat Semua Karya Visual
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </FadeIn>
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        project={selectedProject}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Projects;
