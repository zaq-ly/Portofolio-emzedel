import React from 'react';
import { motion } from 'framer-motion';

const defaultEasing = [0.16, 1, 0.3, 1]; // Custom cubic-bezier for Apple-like smoothness

export const FadeIn = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 30,
  duration = 0.8,
  className = '',
  amount = 0.2, // How much of the element needs to be in view
  once = false // Repeat animation every time it enters view
}) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: { x: 0, y: 0 }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: defaultEasing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
