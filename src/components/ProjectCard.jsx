import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/image';

const ProjectCard = ({ project, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      onClick={onClick}
      className="group bg-gray-50 dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-border hover:border-primary/30 transition-all duration-500 flex flex-col h-full hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
    >
      {/* Image — 1:1 aspect ratio */}
      <div className="relative overflow-hidden aspect-square bg-gray-200 dark:bg-dark-border">
        {/* Skeleton/Shimmer Effect */}
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-shimmer animate-pulse absolute inset-0"></div>
            <Loader2 className="animate-spin text-primary opacity-50 z-20" size={24} />
          </div>
        )}
        
        <img
          src={getOptimizedImageUrl(project.image, 600, 80, 600, 'cover')}
          alt={project.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 z-20">
          <p className="text-white text-xs leading-relaxed line-clamp-2">
            {project.description}
          </p>
          <p className="mt-3 text-[10px] text-white/70 font-medium">
            Karya dibuat oleh Muhammad Zaqly Luluang
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {project.tags.map((tag, tIndex) => (
            <span
              key={tIndex}
              className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white dark:bg-dark rounded-lg text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-dark-border"
            >
              {tag}
            </span>
          ))}
        </div>
        <h4 className="text-sm font-bold text-dark dark:text-white group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h4>
      </div>
    </div>
  );
};

export default ProjectCard;
