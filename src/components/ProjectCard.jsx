import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/image';

const ProjectCard = ({ project, onClick }) => {
  const isDevProject = project.category === 'frontend' || project.category === 'uiux';

  // Advanced hover animations
  const cardVariants = {
    initial: { scale: 1, y: 0, rotateX: 0, rotateY: 0 },
    hover: { 
      scale: 1.02, 
      y: -5,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className="bg-surface-secondary rounded-3xl overflow-hidden shadow-card border border-border/50 cursor-pointer aspect-square relative group"
      onClick={onClick}
    >
      <motion.img
        variants={imageVariants}
        src={getOptimizedImageUrl(project.image, 600, 80)}
        alt={project.title}
        loading="lazy"
        className="w-full h-full object-cover origin-center"
      />
      
      {/* Dark gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <h3 className="text-white font-bold text-xl mb-1 tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {project.title}
        </h3>
        <span className="text-white/70 text-sm font-medium uppercase tracking-wider translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {project.category === 'branding' ? 'Logo' : project.category}
        </span>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
