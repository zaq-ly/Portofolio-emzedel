import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/image';

const ImageModal = ({ isOpen, project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-5xl w-full bg-white border-4 border-black shadow-brutal-lg flex flex-col md:flex-row z-10 max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-primary text-white border-4 border-black p-2 hover:bg-secondary hover:text-black transition-all duration-200"
            >
              <X size={24} />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-2/3 h-[50vh] md:h-auto relative bg-light-gray border-b-4 md:border-b-0 md:border-r-4 border-black flex items-center justify-center overflow-hidden">
              <img
                src={getOptimizedImageUrl(project.image, 1200, 85)}
                alt={project.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <h3 className="text-3xl font-black text-black leading-tight mb-6">
                  {project.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-secondary border-2 border-black"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-black text-black uppercase tracking-widest mb-3">
                      Tentang Project
                    </h4>
                    <p className="text-black text-base leading-relaxed font-bold">
                      {project.description || "Karya desain kreatif oleh Muhammad Zaqly Luluang."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-4 border-black text-center">
                <p className="text-sm font-black text-black uppercase tracking-wider">
                  Karya dibuat oleh Muhammad Zaqly Luluang
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
