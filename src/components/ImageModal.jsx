import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

const ImageModal = ({ isOpen, project, onClose }) => {
  if (!project) return null;

  const handleDownload = (e) => {
    // Optional: add any download tracking or custom logic here
  };

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
            className="absolute inset-0 bg-dark/95 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-5xl w-full bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-dark/50 hover:bg-primary backdrop-blur-md text-white p-2 rounded-full transition-colors duration-300 md:hidden"
            >
              <X size={20} />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-2/3 h-[50vh] md:h-auto relative bg-gray-100 dark:bg-dark flex items-center justify-center overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-between bg-white dark:bg-dark-card overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-display font-bold text-dark dark:text-white leading-tight">
                    {project.title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="hidden md:flex bg-gray-100 dark:bg-dark hover:bg-primary hover:text-white dark:text-gray-400 p-2 rounded-full transition-all duration-300"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Tentang Project
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {project.description || "Karya desain kreatif oleh Muhammad Zaqly Luluang."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-border">
                <a 
                  href={project.image}
                  download={project.title}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                >
                  <Download size={18} />
                  Unduh Karya
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
