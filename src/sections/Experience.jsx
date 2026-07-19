import React from 'react';
import { experiences } from '../data/experience';
import { FadeIn } from '../components/animations/FadeIn';

const Experience = () => {
  return (
    <section id="experience" className="section-padding bg-surface-secondary">
      <div className="max-w-3xl mx-auto">
        <FadeIn direction="up">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-12 text-center">
            Pengalaman.
          </h2>
        </FadeIn>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <FadeIn key={exp.id} delay={index * 0.15} direction="up" distance={30}>
              <div className="flex flex-col md:flex-row md:gap-8 border-b border-border/50 pb-8 last:border-0 last:pb-0">
                <div className="md:w-1/4 mb-2 md:mb-0">
                  <span className="text-sm font-semibold text-text-secondary">
                    {exp.year}
                  </span>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-bold text-text-primary mb-1 tracking-tight">
                    {exp.title}
                  </h3>
                  <p className="text-sm font-medium text-text-primary mb-3">
                    {exp.institution}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
