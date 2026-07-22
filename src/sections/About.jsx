import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { FadeIn } from '../components/animations/FadeIn';
import { FileText, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  // States for Draggable Profile Picture ID Card
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const profileRotateX = useTransform(dragY, [-100, 100], [20, -20]);
  const profileRotateY = useTransform(dragX, [-100, 100], [-20, 20]);
  const lanyardRotateZ = useTransform(dragX, [-200, 200], [8, -8]);

  // 3D tilt states removed for simplicity

  useEffect(() => {
    let ctx;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.refresh();
        const masterContainer = sectionRef.current.querySelector('.about-master-container');
        if (masterContainer) {
          const words = gsap.utils.toArray('.about-desc-word', masterContainer);
          if (words.length > 0) {
            gsap.to(words, {
              color: "#ffffff",
              stagger: 0.1,
              scrollTrigger: {
                trigger: masterContainer,
                start: "top 65%",
                end: "bottom 70%",
                scrub: 1,
              }
            });
          }
        }
      }, sectionRef);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#1a1a1c] overflow-hidden rounded-t-[3rem] md:rounded-t-[4rem] shadow-2xl py-12 lg:py-20"
    >
      <div className="flex flex-col-reverse lg:flex-row w-full max-w-7xl mx-auto items-center px-6 md:px-12 lg:px-20 xl:px-24">

        {/* Left side: Text Content */}
        <div className="w-full lg:w-3/5 pt-10 lg:pt-0 lg:pr-16">
          <div className="w-full">
            <FadeIn direction="up">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-widest text-white uppercase drop-shadow-md">
                TENTANG SAYA
              </h2>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <hr className="w-full border-t-2 border-white/20 my-8 md:my-10" />
            </FadeIn>

            <div className="about-master-container text-sm sm:text-base md:text-lg font-medium leading-relaxed tracking-wide space-y-8 lg:pr-12 text-justify">
              {[
                "Halo! Saya Muhammad Zaqly Luluang, seorang lulusan Teknik Informatika dari Universitas Muslim Indonesia. Saya memiliki minat dan antusiasme yang mendalam di dunia pengembangan perangkat lunak serta desain.",
                "Selama masa studi dan perjalanan karier, saya telah aktif terlibat dalam berbagai proyek pembuatan aplikasi dan karya desain digital. Pengalaman ini tidak hanya mengasah kemampuan teknis saya, tetapi juga mengajarkan saya bagaimana mengelola alur kerja dari tahap konseptualisasi hingga menjadi sebuah produk yang siap digunakan.",
                "Dalam bekerja, saya sangat menghargai kolaborasi tim dan mampu beradaptasi dengan cepat terhadap teknologi baru. Prinsip utama saya adalah teknologi harus mampu memecahkan masalah; oleh karena itu, saya selalu berorientasi pada penciptaan solusi cerdas yang memberikan manfaat nyata dan kemudahan bagi penggunanya."
              ].map((text, index) => (
                <p key={index} className="about-desc-container">
                  {text.split(' ').map((word, i) => (
                    <span key={i} className="about-desc-word text-white/30 mr-[0.25em] inline-block">
                      {word}
                    </span>
                  ))}
                </p>
              ))}
            </div>

            <FadeIn direction="up" delay={0.15} className="mt-8 mb-4">
              <button
                onClick={() => setIsCVModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1a1a1c] font-bold text-sm md:text-base rounded-full hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1"
              >
                <FileText size={20} />
                Lihat CV Saya
              </button>
            </FadeIn>

            <FadeIn direction="up" delay={0.2} className="mt-8">
              <div className="lg:mr-12">
                <div className="bg-white/5 hover:bg-white/10 p-6 md:p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight drop-shadow-md">💡 Yang membuat saya berbeda</h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    Saya bukan hanya bisa mendesain antarmuka, tapi juga mengimplementasikannya langsung ke kode nyata. Satu orang, berbagai keahlian — efisien dan konsisten dari desain ke produk jadi.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Right side: Image (Interactive Draggable ID Card) */}
        <div className="w-full lg:w-2/5 flex justify-center items-center pb-10 lg:pb-0" style={{ perspective: '1500px' }}>

          {/* Draggable Wrapper (Handles X/Y position) */}
          <motion.div
            style={{ x: dragX, y: dragY }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.15}
            className="w-72 sm:w-80 md:w-96 lg:w-[28rem] xl:w-[30rem] aspect-[4/5] relative cursor-grab active:cursor-grabbing z-30"
          >


            {/* Inner Card Container (Handles 3D Tilt) */}
            <motion.div
              style={{ rotateX: profileRotateX, rotateY: profileRotateY }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-[#1a1a1c]"
            >



              <img
                src="/gallery/foto_profil.JPG"
                alt="Muhammad Zaqly Luluang"
                className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
                draggable={false}
              />

              {/* ID Card Info Badge Accent */}
              <div className="absolute bottom-5 left-5 right-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-[1.5rem] p-4 flex items-center justify-between z-20 shadow-xl pointer-events-none">
                <div>
                  <p className="text-white font-bold text-xs sm:text-sm tracking-widest uppercase">Muh Zaqly Luluang</p>
                </div>
                {/* Fake Barcode Graphic */}
                <div className="flex gap-[3px] opacity-100">
                  <div className="w-1 h-8 bg-white rounded-full"></div>
                  <div className="w-2 h-8 bg-white rounded-full"></div>
                  <div className="w-0.5 h-8 bg-white rounded-full"></div>
                  <div className="w-1.5 h-8 bg-white rounded-full"></div>
                  <div className="w-1 h-8 bg-white rounded-full"></div>
                </div>
              </div>

            </motion.div>

          </motion.div>
        </div>

      </div>

      {/* CV Modal */}
      <AnimatePresence>
        {isCVModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsCVModalOpen(false)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            <button
              onClick={() => setIsCVModalOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md border border-white/10"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl h-full max-h-[90vh] bg-[#323639] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src="/CV_Muhammad_Zaqly_Luluang.pdf#toolbar=0&navpanes=0&scrollbar=0"
                className="w-full h-full border-0"
                title="CV Muhammad Zaqly Luluang"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;
