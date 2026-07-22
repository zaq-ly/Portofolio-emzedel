import React from 'react';
import { FadeIn } from '../components/animations/FadeIn';

const Skills = () => {
  const skillPillars = [
    {
      title: 'Front-End Development',
      description: 'Membangun website dan aplikasi web yang responsif, cepat, dan interaktif.',
      skills: ['React', 'JavaScript', 'HTML & CSS', 'Tailwind CSS', 'Responsive Design', 'Git & GitHub'],
    },
    {
      title: 'UI/UX Design',
      description: 'Merancang pengalaman digital yang intuitif, user-friendly, dan estetis.',
      skills: ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'Design System', 'UI Design'],
    },
    {
      title: 'Design & Ilustrasi',
      description: 'Menciptakan karya visual yang unik — dari ilustrasi digital hingga brand identity.',
      skills: ['Adobe Illustrator', 'Affinity', 'Inkscape', 'Digital Illustration', 'Brand Identity', 'Vector Art', 'Photo Editing', 'Layout Design'],
    },
  ];

  return (
    <section id="skills" className="section-padding bg-surface py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn direction="up">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-16 text-center">
            Keahlian.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillPillars.map((pillar, index) => (
            <FadeIn key={index} delay={index * 0.15} direction="up" distance={40}>
              <div className="bg-surface-secondary p-8 rounded-3xl h-full hover:shadow-card transition-shadow duration-500">
                <h3 className="font-bold text-xl text-text-primary mb-3 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-text-secondary mb-8 text-sm">
                  {pillar.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {pillar.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-surface text-text-primary text-xs font-medium rounded-full shadow-sm border border-border/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
