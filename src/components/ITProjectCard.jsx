import React, { useState } from 'react';
import { ArrowUpRight, Github, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

const ITProjectCard = ({ project, onClick }) => {
  const images = project.image ? project.image.split(',') : [];
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  return (
    <div 
      onClick={onClick}
      className="group flex flex-col lg:flex-row bg-surface rounded-[2rem] overflow-hidden border border-border/50 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer w-full"
    >
      {/* Image Container (Bigger & More Prominent) */}
      <div className="w-full lg:w-[65%] xl:w-[70%] aspect-video bg-surface-secondary relative shrink-0 group/slider overflow-hidden">
        {images.length > 1 ? (
          <>
            <div 
              className="flex w-full h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${project.title} - ${idx + 1}`}
                  className="w-full h-full object-cover flex-shrink-0"
                />
              ))}
            </div>
            
            {/* Slider Controls */}
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-text-primary hover:bg-white transition-all opacity-0 group-hover/slider:opacity-100 -translate-x-4 group-hover/slider:translate-x-0"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-text-primary hover:bg-white transition-all opacity-0 group-hover/slider:opacity-100 translate-x-4 group-hover/slider:translate-x-0"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(idx); }}
                  className={`w-2 h-2 rounded-full transition-all ${currentImgIndex === idx ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </>
        ) : (
          <img
            src={images[0]}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-black/5 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
      </div>

      {/* Content Container */}
      <div className="flex flex-col justify-center flex-grow p-6 md:p-8 lg:p-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0071e3] mb-2 block">
              {project.category === 'frontend' ? 'Front-End Development' : 'UI/UX Design'}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary group-hover:text-[#0071e3] transition-colors">
              {project.title}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center group-hover:bg-[#0071e3] group-hover:text-white transition-colors duration-300 shrink-0">
            <ArrowUpRight size={24} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>

        <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 line-clamp-3">
          {project.description || 'Tidak ada deskripsi.'}
        </p>

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.techStack.map((tech, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-surface-secondary text-text-secondary text-xs font-semibold tracking-wide rounded-md border border-border/50">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Action Links */}
        <div className="flex gap-6 mt-auto border-t border-border/50 pt-6">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-[#0071e3] transition-colors">
              <Github size={18} /> Source Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-[#0071e3] transition-colors">
              <Globe size={18} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ITProjectCard;
