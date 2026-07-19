import React from 'react';
import { motion } from 'framer-motion';

const defaultEasing = [0.16, 1, 0.3, 1];

export const TextReveal = ({
  text,
  delay = 0,
  className = '',
  elementType: Wrapper = 'h1',
}) => {
  // Split text by lines, and then by words.
  // Using simple space split here, but you could use regex for more complex cases
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween',
        duration: 0.8,
        ease: defaultEasing,
      },
    },
    hidden: {
      opacity: 0,
      y: 30,
      transition: {
        type: 'tween',
        duration: 0.8,
        ease: defaultEasing,
      },
    },
  };

  return (
    <Wrapper className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ display: 'inline-block', overflow: 'hidden' }}
      >
        {words.map((word, index) => (
          <motion.span
            variants={child}
            key={index}
            style={{ display: 'inline-block', marginRight: '0.25em' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
};
