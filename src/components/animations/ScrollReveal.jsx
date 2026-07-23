import React, { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  baseOpacity = 0.2,
  blurStrength = 1,
  containerClassName = '',
  textClassName = '',
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    const wordElements = el.querySelectorAll('.word');

    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, filter: `blur(${blurStrength}px)` },
      {
        ease: 'none',
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top 85%',
          end: 'bottom 50%',
          scrub: true
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, baseOpacity, blurStrength]);

  return (
    <div ref={containerRef} className={`my-2 ${containerClassName}`}>
      <p className={`m-0 ${textClassName}`}>{splitText}</p>
    </div>
  );
};

export default ScrollReveal;
