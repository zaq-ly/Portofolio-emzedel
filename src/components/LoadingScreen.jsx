import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Noise = ({
  patternSize = 400,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 25
}) => {
  const grainRef = useRef(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId;
    const canvasSize = 1024;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        drawGrain();
      }
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      className="pointer-events-none absolute inset-0 w-full h-full"
      ref={grainRef}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    // Simulasi waktu loading
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="min-h-screen w-full bg-white text-black flex flex-col items-center justify-center overflow-hidden relative"
      initial={{ opacity: 1 }}
      exit={{
        y: "-100vh",
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
      }}
    >
      <div className="absolute inset-0 z-0 opacity-100">
        <Noise patternAlpha={20} />
      </div>

      <div className="flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-sm md:text-base font-medium tracking-[0.2em] text-text-secondary mb-3 md:mb-4"
        >
          Selamat Datang
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="text-xl sm:text-3xl md:text-5xl text-text-primary flex flex-wrap justify-center gap-2 md:gap-3"
        >
          <span className="font-bold">MZL</span>
          <span className="font-extralight tracking-wide">Portofolio</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
