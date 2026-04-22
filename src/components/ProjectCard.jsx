import React from 'react';
import { ExternalLink } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <div className="group bg-dark-card rounded-2xl overflow-hidden border border-dark-border hover:border-primary/30 transition-all duration-500 flex flex-col h-full hover:shadow-lg hover:shadow-primary/5">
      {/* Image — 1:1 aspect ratio */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
          <p className="text-white text-xs leading-relaxed line-clamp-2">
            {project.description}
          </p>
          <button className="mt-3 self-start bg-white/20 backdrop-blur-sm border border-white/30 p-2 rounded-full text-white hover:bg-primary transition-colors duration-300">
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {project.tags.map((tag, tIndex) => (
            <span
              key={tIndex}
              className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-dark rounded-lg text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
        <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h4>
      </div>
    </div>
  );
};

export default ProjectCard;
