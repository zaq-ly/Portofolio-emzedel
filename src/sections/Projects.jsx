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
  const [hoveredProject, setHoveredProject] = useState(null);
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

  // IT Projects (hanya ambil yang di-feature admin, maksimal 6)
  const itProjects = dbProjects.filter(p => itCategories.includes(p.category) && p.isFeatured).slice(0, 6);

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
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start w-full relative animate-pulse">
                <div className="hidden lg:block w-full lg:w-1/2 aspect-[4/3] bg-surface-secondary rounded-[2rem]"></div>
                <div className="w-full lg:w-1/2 flex flex-col pt-4">
                  <div className="border-b-2 border-border/60 pb-6 mb-4 flex justify-between">
                    <div className="h-10 bg-surface-secondary rounded w-1/3"></div>
                    <div className="h-8 bg-surface-secondary rounded w-8"></div>
                  </div>
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="py-8 border-b border-border/40 flex justify-between items-center">
                      <div className="h-8 bg-surface-secondary rounded w-2/3"></div>
                      <div className="h-5 bg-surface-secondary rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : itProjects.length > 0 ? (
              <FadeIn direction="up" delay={0.2}>
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start w-full relative">
                  
                  {/* Left Side: Sticky Image Preview */}
                  <div className="hidden lg:flex w-full lg:w-1/2 lg:sticky lg:top-32 rounded-[2rem] overflow-hidden shadow-2xl bg-surface-secondary border border-border/30 aspect-[4/3] items-center justify-center transition-all duration-500">
                    {(() => {
                      const displayProject = hoveredProject || itProjects[0];
                      const firstImg = displayProject?.image ? displayProject.image.split(',')[0].trim() : '';
                      return firstImg ? (
                        <img 
                          src={firstImg} 
                          alt={displayProject.title} 
                          className="w-full h-full object-cover transition-opacity duration-500"
                        />
                      ) : (
                        <div className="text-text-secondary font-medium">Belum ada preview</div>
                      );
                    })()}
                  </div>

                  {/* Right Side: Scrollable List */}
                  <div className="w-full lg:w-1/2 flex flex-col pt-4">
                    <div className="flex justify-between items-end border-b-2 border-border/60 pb-6 mb-4">
                      <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-text-primary">WORK</h2>
                      <span className="text-2xl font-semibold text-text-primary">{itProjects.length}</span>
                    </div>

                    <div className="flex flex-col">
                      {itProjects.map((project) => {
                        const firstImg = project.image ? project.image.split(',')[0].trim() : '';
                        return (
                          <div 
                            key={project.id}
                            onMouseEnter={() => setHoveredProject(project)}
                            onMouseLeave={() => setHoveredProject(null)}
                            onClick={() => navigate(`/project/${project.id}`)}
                            className="group flex flex-col py-8 border-b border-border/40 cursor-pointer transition-colors duration-300 hover:border-text-primary"
                          >
                            {/* Mobile Preview Image (Shows only on small screens) */}
                            <div className="block lg:hidden w-full aspect-video rounded-2xl overflow-hidden mb-6">
                              {firstImg && <img src={firstImg} alt={project.title} className="w-full h-full object-cover" />}
                            </div>

                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-4 overflow-hidden">
                                <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-text-primary shrink-0 hidden sm:block">
                                  <ArrowRight size={24} />
                                </span>
                                <h3 className="text-3xl sm:text-4xl font-bold tracking-tighter text-text-primary group-hover:pl-2 transition-all duration-300 truncate">
                                  {project.title}
                                </h3>
                              </div>
                              <div className="text-text-secondary font-medium uppercase text-sm sm:text-lg text-right shrink-0 ml-4 group-hover:text-text-primary transition-colors duration-300">
                                {project.category}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </FadeIn>
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
                className="group flex items-center gap-3 px-8 py-4 bg-text-primary text-white rounded-full font-bold text-sm hover:scale-105 transition-all duration-300 shadow-card hover:shadow-lg"
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
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-surface-secondary rounded-3xl aspect-square animate-pulse border border-border/50"></div>
              ))
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
