import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/image';

const ImageModal = ({ isOpen, project, onClose }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!project) return null;

  const isDevProject = project.category === 'frontend' || project.category === 'uiux';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative bg-surface rounded-2xl shadow-elevated overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-primary/5 hover:bg-primary/10 text-text-secondary hover:text-text-primary transition-all"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <div className="relative bg-surface-tertiary flex-shrink-0">
              <img
                src={getOptimizedImageUrl(project.image, 1200, 90)}
                alt={project.title}
                className="w-full max-h-[60vh] object-contain"
              />
            </div>

            {/* Info */}
            <div className="p-6 border-t border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      project.category === 'frontend'
                        ? 'bg-accent/10 text-accent'
                        : project.category === 'uiux'
                        ? 'bg-violet-500/10 text-violet-600'
                        : 'bg-surface-tertiary text-text-secondary'
                    }`}>
                      {project.category === 'frontend' ? 'Front-End' :
                       project.category === 'uiux' ? 'UI/UX' :
                       project.category}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-text-primary mb-1">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-text-secondary text-sm">{project.description}</p>
                  )}

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="tag text-[10px]">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dev project links */}
                {isDevProject && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-all"
                      >
                        <ExternalLink size={14} />
                        Demo
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-surface-tertiary text-text-primary hover:bg-border transition-all"
                      >
                        <Github size={14} />
                        Code
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
