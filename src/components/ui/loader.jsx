import React from 'react';
import { motion } from 'framer-motion';

export const LoaderOne = () => {
  return (
    <div className="flex items-center justify-center space-x-2 p-4">
      {[0, 0.2, 0.4].map((delay, index) => (
        <motion.div
          key={index}
          className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-text-secondary"
          animate={{
            y: [0, -8, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay,
          }}
        />
      ))}
    </div>
  );
};
