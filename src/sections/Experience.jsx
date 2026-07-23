import React, { useEffect, useRef } from 'react';
import { experiences } from '../data/experience';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    let ctx;
    // Small delay to ensure the DOM layout is fully settled after App.jsx fade-in
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.refresh();

        // Animate the heading
        gsap.from('.exp-heading', {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.exp-heading',
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });

        // Animate each item
        itemsRef.current.forEach((item) => {
          if (!item) return;
          gsap.from(item, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          });
        });

        const descContainers = gsap.utils.toArray('.desc-container');
        descContainers.forEach((container) => {
          const words = gsap.utils.toArray('.desc-word', container);
          if (words.length > 0) {
            gsap.to(words, {
              color: "#111827", // Gunakan dark gray/hitam pekat
              fontWeight: 600, // Membuat teks menjadi agak tebal
              stagger: 0.05, // Stagger yang lebih kecil agar tidak menumpuk waktu terlalu lama
              scrollTrigger: {
                trigger: container,
                start: "top 90%", // Mulai lebih awal saat elemen baru masuk layar bawah
                end: "bottom 50%", // Selesai lebih cepat saat bagian bawah teks mencapai tengah layar
                scrub: 1, // Scrubbing yang lebih responsif, tidak terlalu delay
              }
            });
          }
        });
      }, sectionRef);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert(); // Cleanup
    };
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="section-padding bg-surface">
      <div className="max-w-4xl mx-auto">
        <h2 className="exp-heading text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-16 text-center">
          Pengalaman.
        </h2>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              ref={el => itemsRef.current[index] = el}
              className="flex flex-col items-center text-center pb-12 border-b border-border/50 last:border-0 last:pb-0"
            >
              <span className="text-sm font-bold tracking-widest text-text-primary/60 mb-2">
                {exp.year}
              </span>

              <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-2 tracking-tight">
                {exp.title}
              </h3>

              <p className="text-lg font-medium text-text-secondary mb-6">
                {exp.institution}
              </p>

              {exp.description && (
                <p className="desc-container text-base leading-relaxed mb-6 max-w-2xl text-justify">
                  {exp.description.split(' ').map((word, i) => (
                    <span key={i} className="desc-word text-gray-400">
                      {word}{' '}
                    </span>
                  ))}
                </p>
              )}

              {exp.points && (
                <ul className="text-left inline-block space-y-3 text-text-secondary/90 w-full max-w-lg">
                  {exp.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-text-primary shrink-0" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
