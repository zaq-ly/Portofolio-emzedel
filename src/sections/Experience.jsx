import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import { experiences } from '../data/experience';

const Experience = () => {
  return (
    <section id="experience" className="section-padding bg-surface-secondary">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="section-label">Pengalaman</span>
          <h2 className="section-title mb-4">
            Perjalanan <span className="text-accent">Saya</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Timeline pendidikan dan pengalaman yang membentuk skill saya hari ini.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          <div className="space-y-8 md:space-y-12">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot on timeline */}
                  <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-accent border-4 border-surface-secondary -translate-x-1/2 mt-6 z-10" />

                  {/* Spacer for mobile (left side of dot) */}
                  <div className="w-12 flex-shrink-0 md:hidden" />

                  {/* Content card */}
                  <div className={`flex-1 md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="card p-6 hover:shadow-card-hover">
                      {/* Year badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="tag-accent text-[10px]">
                          {exp.year}
                        </span>
                        <span className={`p-1 rounded-md ${
                          exp.type === 'education' 
                            ? 'bg-amber-50 text-amber-600' 
                            : 'bg-accent/5 text-accent'
                        }`}>
                          {exp.type === 'education' 
                            ? <GraduationCap size={14} /> 
                            : <Briefcase size={14} />
                          }
                        </span>
                      </div>

                      <h3 className="font-display font-semibold text-text-primary mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-xs font-medium text-accent mb-2">
                        {exp.institution}
                      </p>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>

                  {/* Empty spacer for the other side (desktop) */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-sm text-text-tertiary mt-12"
        >
          Terus bertumbuh dan berkembang setiap hari 📈
        </motion.p>
      </div>
    </section>
  );
};

export default Experience;
