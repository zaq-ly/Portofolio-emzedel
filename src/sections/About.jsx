import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="section-padding bg-surface-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left — Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-5/12 relative"
          >
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-accent/5 rounded-3xl transform rotate-3" />
              <div className="relative bg-surface rounded-3xl overflow-hidden border border-border shadow-card">
                <img
                  src="/gallery/foto_profil.JPG"
                  alt="Muhammad Zaqly Luluang"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-7/12"
          >
            <span className="section-label">Tentang Saya</span>

            <h2 className="section-title mb-6">
              Dari Desainer Menjadi{' '}
              <span className="text-accent">Creative Developer</span>
            </h2>

            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Halo! Saya <span className="font-semibold text-text-primary">Muhammad Zaqly Luluang</span> — seorang yang memulai perjalanan kreatif dari dunia desain grafis dan ilustrasi digital.
              </p>
              <p>
                Berawal dari hobi menggambar dan eksperimen visual, saya jatuh cinta dengan proses kreatif. Seiring waktu, ketertarikan saya berkembang ke <span className="font-semibold text-text-primary">UI/UX Design</span> — merancang pengalaman digital yang tidak hanya indah tapi juga fungsional.
              </p>
              <p>
                Kemudian saya bertanya: <em>"Kenapa hanya desain? Kenapa tidak sekalian saya yang bangun?"</em> — Dan di situlah saya mulai mendalami <span className="font-semibold text-text-primary">Front-End Development</span>. Sekarang, saya bisa handle full pipeline: dari sketsa awal, wireframe, hingga production code.
              </p>
            </div>

            {/* Value proposition */}
            <div className="mt-8 p-5 rounded-2xl bg-surface border border-border">
              <p className="text-sm font-medium text-text-primary mb-1">
                💡 Yang membuat saya berbeda:
              </p>
              <p className="text-sm text-text-secondary">
                Saya bukan hanya bisa mendesain mockup, tapi juga <span className="font-semibold text-text-primary">mengimplementasikan</span> langsung ke kode nyata. Satu orang, tiga keahlian — efisien dan konsisten dari desain ke produk jadi.
              </p>
            </div>

            <div className="mt-8">
              <a
                href="#skills"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                Lihat keahlian saya
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
