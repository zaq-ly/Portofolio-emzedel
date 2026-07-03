import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/image';

const ProjectCard = ({ project, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group bg-white border-4 border-black shadow-brutal hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal-lg active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all duration-200 flex flex-col h-full cursor-pointer"
    >
      {/* Image — 1:1 aspect ratio */}
      <div className="relative overflow-hidden aspect-square bg-light-gray border-b-4 border-black group-hover:p-2 transition-all duration-300">
        {/* Skeleton/Loading */}
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        )}

        <img
          src={getOptimizedImageUrl(project.image, 600, 80, 600, 'cover')}
          alt={project.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag, tIndex) => (
            <span
              key={tIndex}
              className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-secondary border-2 border-black"
            >
              {tag}
            </span>
          ))}
        </div>
        <h4 className="text-lg font-black text-black">
          {project.title}
        </h4>
      </div>
    </div>
  );
};

export default ProjectCard;
