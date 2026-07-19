import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '../components/animations/FadeIn';

const About = () => {
  const containerRef = useRef(null);
  
  // Create a scroll-linked animation for pinning effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <motion.section 
      id="about" 
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-black py-32 rounded-t-[3rem] md:rounded-t-[4rem]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
          
          {/* Left side: Sticky Heading */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <FadeIn direction="right">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                  Tentang Saya.
                </h2>
                <p className="text-gray-400 text-lg font-medium">
                  Perjalanan dari kanvas digital menuju baris kode.
                </p>
              </FadeIn>
            </div>
          </div>

          {/* Right side: Scrolling Content */}
          <div className="lg:w-2/3 flex flex-col gap-24 py-16">
            {[
              "Halo! Saya Muhammad Zaqly Luluang — seorang yang memulai perjalanan kreatif dari dunia desain grafis dan ilustrasi digital.",
              "Berawal dari hobi menggambar dan eksperimen visual, saya jatuh cinta dengan proses kreatif. Seiring waktu, ketertarikan saya berkembang ke UI/UX Design — merancang pengalaman digital yang tidak hanya indah tapi juga fungsional.",
              "Kemudian saya bertanya: \"Kenapa hanya desain? Kenapa tidak sekalian saya yang bangun?\" — Dan di situlah saya mulai mendalami Front-End Development. Sekarang, saya bisa handle full pipeline: dari sketsa awal, wireframe, hingga production code."
            ].map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0.2 }}
                whileInView={{ opacity: 1 }}
                viewport={{ amount: 0.3, margin: "-30% 0px -30% 0px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-2xl md:text-3xl text-white leading-relaxed font-medium tracking-tight"
              >
                {text}
              </motion.p>
            ))}

            <FadeIn direction="up" distance={50} duration={1}>
              <div className="bg-[#111] p-10 rounded-3xl shadow-xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">💡 Yang membuat saya berbeda</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Saya bukan hanya bisa mendesain mockup, tapi juga mengimplementasikan langsung ke kode nyata. Satu orang, tiga keahlian — efisien dan konsisten dari desain ke produk jadi.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
