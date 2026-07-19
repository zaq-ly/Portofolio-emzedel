import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Typewriter = ({ 
  text, 
  delay = 0, 
  speed = 50, 
  deleteSpeed = 30,
  pauseTime = 3000,
  className = "" 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout;
    let isMounted = true;
    let currentIndex = 0;
    
    const type = () => {
      if (!isMounted) return;
      setIsTyping(true);
      
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
        timeout = setTimeout(type, speed);
      } else {
        setIsTyping(false);
        // Wait for pauseTime, then start erasing
        timeout = setTimeout(erase, pauseTime);
      }
    };
    
    const erase = () => {
      if (!isMounted) return;
      setIsTyping(true);
      
      if (currentIndex >= 0) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex--;
        timeout = setTimeout(erase, deleteSpeed);
      } else {
        setIsTyping(false);
        // Start typing again after a small wait
        currentIndex = 0;
        timeout = setTimeout(type, 500);
      }
    };

    // Initial delay before first type
    timeout = setTimeout(type, delay * 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [text, speed, deleteSpeed, pauseTime, delay]);

  return (
    <span className={`inline-block ${className}`}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 0.8, 
          ease: "easeInOut" 
        }}
        className="inline-block w-[3px] h-[1em] bg-current ml-[2px] align-middle rounded-full"
        style={{ 
          opacity: isTyping ? 1 : 0.8 
        }}
      />
    </span>
  );
};
