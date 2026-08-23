import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/image';
import { parseProjectImages } from '../utils/projects';

const ImageModal = ({ isOpen, project, onClose, initialIndex = 0 }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(initialIndex);

  // Reset index when project changes, modal opens, or initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentImgIndex(initialIndex);
    }
  }, [project, isOpen, initialIndex]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('modalStateChange', { detail: { isOpen } }));
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('modalStateChange', { detail: { isOpen: false } }));
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!project) return null;

  const isDevProject = project.category === 'frontend' || project.category === 'uiux';
  const parsedImages = parseProjectImages(project.image);
  const totalImages = parsedImages.length;
  const isMultiImage = totalImages > 1;
  const safeIndex = totalImages > 0 ? Math.min(Math.max(0, currentImgIndex), totalImages - 1) : 0;
  const currentItem = parsedImages[safeIndex] || { label: '', url: '' };
  const currentImageLabel = currentItem.label || (safeIndex === 0 ? 'Homepage' : `Preview ${safeIndex + 1}`);
  const showLabel = Boolean(currentItem.label) || (isDevProject && isMultiImage);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-0"
          onClick={onClose}
        >
          {/* Cinematic Dark Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-[200] p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all backdrop-blur-md border border-white/20 shadow-lg"
          >
            <X size={24} />
          </button>

          {/* Content Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full overflow-y-auto md:overflow-hidden p-0 md:p-8 pb-0 md:pb-8 relative group flex flex-col md:items-center md:justify-center">
              {totalImages > 1 ? (
                <>
                  <div className="w-full min-h-full relative flex flex-col md:items-center md:justify-center overflow-y-auto md:overflow-hidden m-auto">
                    {currentItem.url ? (
                      <img
                        src={getOptimizedImageUrl(currentItem.url, 1600, 90)}
                        alt={`${project.title} - ${safeIndex + 1}`}
                        className="w-full md:w-auto h-auto md:max-w-full md:max-h-full md:object-contain md:rounded-md md:shadow-2xl m-auto"
                      />
                    ) : null}
                  </div>
                  
                  {/* Controls */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(prev => (prev - 1 + totalImages) % totalImages); }}
                    className="fixed md:absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-all border border-white/10 z-50"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(prev => (prev + 1) % totalImages); }}
                    className="fixed md:absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-all border border-white/10 z-50"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Dots */}
                  <div className="fixed md:absolute bottom-[220px] md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-[200]">
                    {parsedImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(idx); }}
                        className={`w-2 h-2 rounded-full transition-all shadow-md border border-black/10 ${safeIndex === idx ? 'bg-white w-5' : 'bg-white/50 hover:bg-white/80'}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full min-h-full flex flex-col md:items-center md:justify-center m-auto">
                  {currentItem.url ? (
                    <img
                      src={getOptimizedImageUrl(currentItem.url, 1600, 90)}
                      alt={project.title}
                      className="w-full md:w-auto h-auto md:max-w-full md:max-h-full md:object-contain md:rounded-md md:shadow-2xl m-auto"
                    />
                  ) : (
                    <div className="text-white/50 font-medium">Belum ada preview</div>
                  )}
                </div>
              )}
            </div>

            {/* Info Overlay (Lighter cinematic bottom gradient) */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-24 pb-8 px-6 md:px-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pointer-events-none">
              <div className="min-w-0 flex-1 max-w-3xl pointer-events-auto">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                    {project.category === 'frontend' ? 'Front-End' :
                     project.category === 'uiux' ? 'UI/UX' :
                     project.category === 'branding' ? 'Logo' :
                     project.category}
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl md:text-4xl text-white mb-3 tracking-tight">
                  {project.title}
                </h3>
                
                {project.category === 'certificate' ? (
                  project.description && (
                    <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
                      {project.description.replace(' / ', ' - ')}
                    </p>
                  )
                ) : (
                  showLabel && (
                    <p className="text-[#0071e3] text-lg md:text-xl font-bold leading-relaxed mb-4 tracking-wide capitalize">
                      {currentImageLabel}
                    </p>
                  )
                )}

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-xs font-medium backdrop-blur-sm border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Dev project links */}
              {isDevProject && (
                <div className="flex flex-wrap items-center gap-3 flex-shrink-0 mt-4 md:mt-0 pointer-events-auto">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-full bg-white text-black hover:bg-gray-200 transition-all shadow-lg"
                    >
                      <ExternalLink size={18} />
                      Kunjungi Web
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md border border-white/10"
                    >
                      <Github size={18} />
                      Kode Sumber
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
