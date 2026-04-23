import React, { useState } from 'react';
import { Download } from 'lucide-react';

const ProjectCard = ({ project, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation(); // Mencegah modal terbuka
    try {
      const response = await fetch(project.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.title || 'karya'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(project.image, '_blank');
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-gray-50 dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-border hover:border-primary/30 transition-all duration-500 flex flex-col h-full hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
    >
      {/* Image — 1:1 aspect ratio */}
      <div className="relative overflow-hidden aspect-square bg-gray-200 dark:bg-dark-border">
        {/* Skeleton/Shimmer Effect */}
        {!isLoaded && (
          <div className="absolute inset-0 z-10">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-shimmer animate-pulse"></div>
          </div>
        )}
        
        <img
          src={project.image}
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
          <button 
            onClick={handleDownload}
            className="mt-3 self-start bg-white/20 backdrop-blur-sm border border-white/30 p-2 rounded-full text-white hover:bg-primary transition-colors duration-300"
            title="Unduh Karya"
          >
            <Download size={16} />
          </button>
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
