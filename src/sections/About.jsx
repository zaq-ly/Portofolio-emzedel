import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { FadeIn } from '../components/animations/FadeIn';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  
  // States for Draggable Profile Picture ID Card
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const profileRotateX = useTransform(dragY, [-100, 100], [20, -20]);
  const profileRotateY = useTransform(dragX, [-100, 100], [-20, 20]);
  const lanyardRotateZ = useTransform(dragX, [-200, 200], [8, -8]);

  // States for premium hover effect (Left card)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });
    
    // Calculate 3D tilt (max 15 degrees)
    const rX = ((y / rect.height) - 0.5) * -30;
    const rY = ((x / rect.width) - 0.5) * 30;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

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
                start: "top 70%",
                end: "bottom 40%",
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
            
            <FadeIn direction="up" delay={0.2} className="mt-12">
              <div style={{ perspective: 1000 }} className="lg:mr-12">
                <motion.div 
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={handleMouseLeave}
                  animate={{ rotateX, rotateY }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="relative bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 overflow-hidden cursor-pointer group"
                >
                  {/* Spotlight Glow Effect */}
                  <motion.div
                    className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent 40%)`
                    }}
                  />
                  
                  {/* 3D Floating Content */}
                  <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight drop-shadow-md">💡 Yang membuat saya berbeda</h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                      Saya bukan hanya bisa mendesain antarmuka, tapi juga mengimplementasikannya langsung ke kode nyata. Satu orang, berbagai keahlian — efisien dan konsisten dari desain ke produk jadi.
                    </p>
                  </div>
                </motion.div>
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
    </section>
  );
};

export default About;
