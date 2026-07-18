import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/image';

const ProjectCard = ({ project, onClick }) => {
  const isDevProject = project.category === 'frontend' || project.category === 'uiux';

  return (
    <motion.div
      className="card group cursor-pointer overflow-hidden"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-tertiary">
        <img
          src={getOptimizedImageUrl(project.image, 600, 80)}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-3">
            {isDevProject ? (
              <>
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-white text-primary hover:bg-accent hover:text-white transition-all"
                    title="Live Demo"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                {project.githubUrl && project.githubUrl !== '#' && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-white text-primary hover:bg-accent hover:text-white transition-all"
                    title="GitHub"
                  >
                    <Github size={18} />
                  </a>
                )}
                <div className="p-2.5 rounded-xl bg-white/90 text-primary">
                  <Eye size={18} />
                </div>
              </>
            ) : (
              <div className="p-2.5 rounded-xl bg-white/90 text-primary">
                <Eye size={18} />
              </div>
            )}
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md backdrop-blur-sm ${
            project.category === 'frontend'
              ? 'bg-accent/90 text-white'
              : project.category === 'uiux'
              ? 'bg-violet-500/90 text-white'
              : 'bg-white/90 text-text-primary'
          }`}>
            {project.category === 'frontend' ? 'Front-End' :
             project.category === 'uiux' ? 'UI/UX' :
             project.category === 'branding' ? 'Logo' :
             project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-text-primary text-sm mb-1 truncate group-hover:text-accent transition-colors">
          {project.title}
        </h3>

        {project.description && (
          <p className="text-text-tertiary text-xs line-clamp-2 mb-3">
            {project.description}
          </p>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface-tertiary text-text-tertiary"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface-tertiary text-text-tertiary">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
