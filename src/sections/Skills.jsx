import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2, Layout, Palette,
  // Front-End icons
  FileCode, Globe, Smartphone, GitBranch, Zap, Layers,
  // UI/UX icons
  Figma, PenTool, Users, Grid3X3, MousePointer, Lightbulb,
  // Design icons
  Image, Brush, Type, Shapes, Camera, Sparkles,
} from 'lucide-react';

const Skills = () => {
  const skillPillars = [
    {
      icon: <Code2 size={24} />,
      title: 'Front-End Development',
      description: 'Membangun website dan aplikasi web yang responsif, cepat, dan interaktif.',
      color: 'accent',
      bgClass: 'bg-accent/5 border-accent/10',
      iconBgClass: 'bg-accent/10 text-accent',
      skills: [
        { name: 'React', icon: <Zap size={14} /> },
        { name: 'JavaScript', icon: <FileCode size={14} /> },
        { name: 'HTML & CSS', icon: <Globe size={14} /> },
        { name: 'Tailwind CSS', icon: <Layers size={14} /> },
        { name: 'Framer Motion', icon: <Sparkles size={14} /> },
        { name: 'Responsive Design', icon: <Smartphone size={14} /> },
        { name: 'Git & GitHub', icon: <GitBranch size={14} /> },
      ],
    },
    {
      icon: <Layout size={24} />,
      title: 'UI/UX Design',
      description: 'Merancang pengalaman digital yang intuitif, user-friendly, dan estetis.',
      color: 'violet',
      bgClass: 'bg-violet-50 border-violet-100',
      iconBgClass: 'bg-violet-100 text-violet-600',
      skills: [
        { name: 'Figma', icon: <Figma size={14} /> },
        { name: 'Wireframing', icon: <Grid3X3 size={14} /> },
        { name: 'Prototyping', icon: <MousePointer size={14} /> },
        { name: 'User Research', icon: <Users size={14} /> },
        { name: 'Design System', icon: <Layers size={14} /> },
        { name: 'UI Design', icon: <PenTool size={14} /> },
      ],
    },
    {
      icon: <Palette size={24} />,
      title: 'Design & Ilustrasi',
      description: 'Menciptakan karya visual yang unik — dari ilustrasi digital hingga brand identity.',
      color: 'amber',
      bgClass: 'bg-amber-50 border-amber-100',
      iconBgClass: 'bg-amber-100 text-amber-600',
      skills: [
        { name: 'Adobe Illustrator', icon: <PenTool size={14} /> },
        { name: 'Digital Illustration', icon: <Brush size={14} /> },
        { name: 'Brand Identity', icon: <Type size={14} /> },
        { name: 'Vector Art', icon: <Shapes size={14} /> },
        { name: 'Photo Editing', icon: <Camera size={14} /> },
        { name: 'Layout Design', icon: <Image size={14} /> },
      ],
    },
  ];

  return (
    <section id="skills" className="section-padding bg-surface">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="section-label">Keahlian</span>
          <h2 className="section-title mb-4">
            Tiga Pilar <span className="text-accent">Keahlian</span> Saya
          </h2>
          <p className="section-subtitle mx-auto">
            Kombinasi skill yang memungkinkan saya handle full pipeline — dari konsep kreatif hingga implementasi teknis.
          </p>
        </motion.div>

        {/* Skill Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillPillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl border p-6 ${pillar.bgClass} transition-all duration-300 hover:shadow-card`}
            >
              {/* Icon & Title */}
              <div className={`inline-flex p-3 rounded-xl mb-4 ${pillar.iconBgClass}`}>
                {pillar.icon}
              </div>
              <h3 className="font-display font-bold text-lg text-text-primary mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                {pillar.description}
              </p>

              {/* Skills list */}
              <div className="space-y-2">
                {pillar.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/60
                               text-sm text-text-primary font-medium
                               transition-all duration-200 hover:bg-white hover:shadow-soft"
                  >
                    <span className="text-text-tertiary">{skill.icon}</span>
                    {skill.name}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-sm text-text-tertiary mt-12"
        >
          Selalu belajar dan menambah skill baru 🚀
        </motion.p>
      </div>
    </section>
  );
};

export default Skills;
