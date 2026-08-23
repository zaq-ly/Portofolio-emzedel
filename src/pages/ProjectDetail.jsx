import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Loader2, LayoutGrid, Maximize2 } from 'lucide-react';
import { fetchProjects } from '../lib/projectsService';
import { transformProjectForGallery, parseProjectImages } from '../utils/projects';
import { FadeIn } from '../components/animations/FadeIn';
import ImageModal from '../components/ImageModal';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({});
  const [viewMode, setViewMode] = useState('auto'); // Default to auto, user can toggle to grid or full
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProject = async () => {
      try {
        const data = await fetchProjects();
        // Handle ID which could be a string or number
        const found = data.map(transformProjectForGallery).find(p => p.id === parseInt(id) || p.id === id);
        setProject(found || null);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const parsedImages = parseProjectImages(project?.image);

  useEffect(() => {
    if (!project) return;
    parsedImages.forEach((item, i) => {
      const img = new Image();
      img.onload = () => {
        setDimensions(prev => ({ ...prev, [i]: { width: img.width, height: img.height } }));
      };
      img.src = item.url;
    });
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="animate-spin text-text-secondary" size={32} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Project tidak ditemukan</h2>
        <button onClick={() => navigate('/it-projects')} className="px-6 py-2 bg-[#0071e3] text-white rounded-full font-medium hover:bg-[#0077ED] transition-colors">
          Kembali
        </button>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-primary">
      {/* Sticky Premium Back Button */}
      <div className="fixed top-8 left-4 sm:left-8 z-50">
        <button 
          onClick={() => navigate('/it-projects')}
          className="group flex items-center gap-3 px-5 py-3 bg-text-primary text-surface rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:scale-105 transition-all duration-300 font-bold text-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="hidden sm:inline">Kembali</span>
        </button>
      </div>

      <main className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6">
        <FadeIn direction="up">
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary">
                {project.title}
              </h1>
              
              {/* Toggle View Mode */}
              <div className="flex bg-surface-secondary rounded-lg p-1 border border-border/50 shrink-0 self-start">
                <button 
                  onClick={() => setViewMode('auto')}
                  className={`p-2 rounded-md transition-colors flex items-center justify-center ${viewMode === 'auto' ? 'bg-surface shadow text-[#0071e3]' : 'text-text-secondary hover:text-text-primary'}`}
                  title="Auto Layout"
                >
                  <span className="text-xs font-bold px-2">AUTO</span>
                </button>
                <button 
                  onClick={() => setViewMode('full')}
                  className={`p-2 rounded-md transition-colors flex items-center justify-center ${viewMode === 'full' ? 'bg-surface shadow text-[#0071e3]' : 'text-text-secondary hover:text-text-primary'}`}
                  title="Full Width"
                >
                  <Maximize2 size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors flex items-center justify-center ${viewMode === 'grid' ? 'bg-surface shadow text-[#0071e3]' : 'text-text-secondary hover:text-text-primary'}`}
                  title="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="px-4 py-1.5 bg-[#0071e3]/10 text-[#0071e3] font-semibold text-sm rounded-full uppercase tracking-wider">
                {project.category}
              </span>
              
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary hover:text-[#0071e3] transition-colors font-medium">
                  <ExternalLink size={18} /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium">
                  <Github size={18} /> Source Code
                </a>
              )}
            </div>

            {project.description && (
              <p className="text-lg text-text-secondary leading-relaxed max-w-3xl mb-8 whitespace-pre-line">
                {project.description}
              </p>
            )}

            {project.techStack && project.techStack.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 bg-surface-secondary text-text-secondary text-sm font-medium rounded-lg border border-border/50">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        <div className="flex flex-wrap justify-center items-start gap-8 gap-y-16">
          {parsedImages.map((item, i) => {
            const dim = dimensions[i];
            const isLoaded = !!dim;
            const isPortrait = isLoaded && dim.width < dim.height;
            
            let isGrid = false;
            if (viewMode === 'grid') isGrid = true;
            else if (viewMode === 'full') isGrid = false;
            else isGrid = isPortrait; // auto mode

            const displayLabel = item.label || (i === 0 ? 'Homepage' : `Preview ${i + 1}`);

            return (
              <FadeIn 
                key={i} 
                direction="up" 
                delay={i * 0.1}
                className={`transition-opacity duration-500 flex flex-col items-center ${isLoaded ? 'opacity-100' : 'opacity-0'} ${isGrid ? 'w-[45%] md:w-[30%] lg:w-[28%] max-w-[340px]' : 'w-full max-w-4xl'}`}
              >
                <h3 className="text-sm font-bold text-text-secondary tracking-[0.2em] uppercase mb-6 text-center w-full">
                  {displayLabel}
                </h3>
                <div 
                  className="w-full rounded-2xl overflow-hidden shadow-xl border border-border/20 cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative group"
                  onClick={() => {
                    setSelectedImageIndex(i);
                    setIsModalOpen(true);
                  }}
                >
                  <img src={item.url} alt={`${project.title} - ${displayLabel}`} className="w-full h-auto object-cover block mx-auto" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                    <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" size={32} />
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </main>

      <ImageModal
        isOpen={isModalOpen}
        project={project}
        initialIndex={selectedImageIndex}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProjectDetail;
