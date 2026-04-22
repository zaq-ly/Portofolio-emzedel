import React from 'react';
import { ExternalLink } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <div className="group bg-dark-card rounded-2xl overflow-hidden border border-dark-border hover:border-primary/30 transition-all duration-500 flex flex-col h-full hover:shadow-lg hover:shadow-primary/5">
      {/* Image */}
      <div className="relative overflow-hidden h-60">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <button className="bg-white p-2.5 rounded-full text-dark hover:bg-primary hover:text-white transition-colors duration-300">
            <ExternalLink size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag, tIndex) => (
            <span
              key={tIndex}
              className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-dark rounded-lg text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
        <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h4>
        <p className="text-sm text-gray-500 leading-relaxed mt-2 flex-grow">
          {project.description}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
