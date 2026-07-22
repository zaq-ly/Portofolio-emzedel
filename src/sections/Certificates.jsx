import React, { useState, useEffect, useRef } from 'react';
import { fetchProjects } from '../lib/projectsService';
import { transformProjectForGallery } from '../utils/projects';
import { FadeIn } from '../components/animations/FadeIn';
import ImageModal from '../components/ImageModal';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const carouselWrapperRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProjects();
        if (data && data.length > 0) {
          const transformed = data.map(transformProjectForGallery);
          setCertificates(transformed.filter(p => p.category === 'certificate'));
        }
      } catch (err) {
        console.error('Error fetching certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // GSAP Scroll Animation
    let ctx = gsap.context(() => {
      gsap.from(carouselWrapperRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 25%",
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        scale: 0.9,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleOpenModal = (cert) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  const nextSlide = () => {
    if (currentIndex < certificates.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <section ref={sectionRef} id="certificates" className="w-full bg-[#111113] text-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative z-20 overflow-hidden my-12 py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        {/* Left Side: Typography */}
        <div className="w-full lg:w-1/3 flex flex-col justify-center z-10">
          <FadeIn direction="up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
              <span className="text-white/60 text-2xl md:text-3xl font-medium block mb-2 uppercase tracking-widest">Pencapaian</span>
              Sertifikasi &<br />
              <span className="text-white">Kompetensi</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 font-medium mb-8 max-w-md">
              Kumpulan sertifikat pelatihan dan pencapaian profesional yang telah diverifikasi.
              <br/><br/>
              <span className="text-sm text-white/40 border border-white/10 px-3 py-1.5 rounded-full mt-2 inline-block">Geser untuk melihat ➔</span>
            </p>
          </FadeIn>
        </div>

        {/* Right Side: Cover Flow Carousel */}
        <div ref={carouselWrapperRef} className="w-full lg:w-2/3 relative h-[350px] sm:h-[450px] md:h-[550px] flex items-center justify-center perspective-[1200px]">
          {loading ? (
            <div className="w-[70vw] md:w-[500px] aspect-[4/3] bg-white/5 rounded-2xl animate-pulse" />
          ) : certificates.length > 0 ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence initial={false} mode="popLayout">
                {certificates.map((cert, index) => {
                  const offset = index - currentIndex;
                  const absOffset = Math.abs(offset);
                  
                  // Only render items that are close to the center to save DOM nodes
                  if (absOffset > 2) return null;
                  
                  const isCenter = offset === 0;
                  
                  // Animation values
                  const x = `${offset * 60}%`; // Overlap distance
                  const scale = isCenter ? 1 : 0.8;
                  const zIndex = 10 - absOffset;
                  const opacity = absOffset > 1 ? 0 : 1; // Show only 3 items clearly (center + 1 left + 1 right)
                  
                  const coverImage = cert.image ? cert.image.split(',')[0].trim() : '';

                  return (
                    <motion.div
                      key={cert.id}
                      initial={false}
                      animate={{ x, scale, zIndex, opacity }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      className={`group absolute w-[75vw] sm:w-[450px] md:w-[600px] aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${isCenter ? 'cursor-zoom-in' : 'cursor-grab active:cursor-grabbing'}`}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragStart={() => isDragging.current = true}
                      onDragEnd={(e, { offset, velocity }) => {
                        setTimeout(() => { isDragging.current = false; }, 150);
                        const swipe = offset.x + velocity.x * 0.5;
                        if (swipe < -30 && currentIndex < certificates.length - 1) {
                          nextSlide();
                        } else if (swipe > 30 && currentIndex > 0) {
                          prevSlide();
                        }
                      }}
                      onClick={(e) => {
                        if (isDragging.current) {
                          e.preventDefault();
                          return;
                        }
                        if (isCenter) handleOpenModal(cert);
                        else setCurrentIndex(index);
                      }}
                    >
                      {/* Image */}
                      <img 
                        src={coverImage} 
                        alt={cert.title} 
                        draggable="false"
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                      
                      {/* Dark Overlay for non-centered items */}
                      <motion.div 
                        animate={{ opacity: isCenter ? 0 : 0.6 }} 
                        className="absolute inset-0 bg-black pointer-events-none"
                      />

                      {/* Detail overlay for centered item (Hover only) */}
                      <div 
                        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8 pointer-events-none transition-opacity duration-300 ${isCenter ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}
                      >
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 drop-shadow-md">
                          {cert.title}
                        </h3>
                        <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm font-medium">
                          <span>{cert.description?.replace(' / ', ' - ')}</span>
                          {cert.tags && cert.tags.length > 0 && (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
                              <span>{cert.tags[0]}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-white/40 font-medium">Belum ada sertifikat.</div>
          )}


        </div>

      </div>

      <ImageModal
        isOpen={isModalOpen}
        project={selectedCert}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Certificates;
