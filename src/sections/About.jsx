import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '../components/animations/FadeIn';

const About = () => {
  return (
    <section 
      id="about" 
      className="relative bg-[#1a1a1c] overflow-hidden rounded-t-[3rem] md:rounded-t-[4rem] shadow-2xl"
    >
      <div className="flex flex-col-reverse lg:flex-row w-full min-h-screen">
        
        {/* Left side: Text Content */}
        <div className="w-full lg:w-3/5 flex items-center p-8 sm:p-12 md:p-16 lg:p-24 xl:pl-32">
          <div className="w-full max-w-4xl">
            <FadeIn direction="up">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-widest text-white uppercase drop-shadow-md">
                TENTANG SAYA
              </h2>
            </FadeIn>
            
            <FadeIn direction="right" delay={0.2}>
              <hr className="w-full border-t-2 border-white/20 my-8 md:my-10" />
            </FadeIn>
            
            <div className="text-gray-300 text-sm sm:text-base md:text-lg font-medium leading-relaxed tracking-wide space-y-8 lg:pr-12">
              {[
                "Halo! Saya Muhammad Zaqly Luluang — seorang yang memulai perjalanan kreatif dari dunia desain grafis dan ilustrasi digital.",
                "Berawal dari hobi menggambar dan eksperimen visual, saya jatuh cinta dengan proses kreatif. Seiring waktu, ketertarikan saya berkembang ke UI/UX Design — merancang pengalaman digital yang tidak hanya indah tapi juga fungsional.",
                "Kemudian saya bertanya: \"Kenapa hanya desain? Kenapa tidak sekalian saya yang bangun?\" — Dan di situlah saya mulai mendalami Front-End Development. Sekarang, saya bisa menangani sepenuhnya dari awal: dari sketsa, wireframe, hingga ke baris kode."
              ].map((text, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0.2, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {text}
                </motion.p>
              ))}
            </div>
            
            <FadeIn direction="up" delay={0.2} className="mt-12">
              <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 backdrop-blur-sm lg:mr-12">
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">💡 Yang membuat saya berbeda</h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  Saya bukan hanya bisa mendesain antarmuka, tapi juga mengimplementasikannya langsung ke kode nyata. Satu orang, berbagai keahlian — efisien dan konsisten dari desain ke produk jadi.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Right side: Image */}
        <div className="w-full lg:w-2/5 relative min-h-[50vh] lg:min-h-[90vh] lg:h-auto border-t lg:border-t-0 lg:border-l border-white/10">
           <img 
             src="/gallery/foto_profil.JPG" 
             alt="Muhammad Zaqly Luluang"
             className="absolute inset-0 w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
           />
        </div>

      </div>
    </section>
  );
};

export default About;
