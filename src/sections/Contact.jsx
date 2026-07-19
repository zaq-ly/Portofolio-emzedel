import React from 'react';
import { Mail, Linkedin, Instagram, Github, ArrowUpRight } from 'lucide-react';
import { FadeIn } from '../components/animations/FadeIn';

const Contact = () => {
  const contacts = [
    {
      icon: <Mail size={20} />,
      title: 'Email',
      detail: 'muhammadzaqly01@gmail.com',
      link: 'mailto:muhammadzaqly01@gmail.com',
    },
    {
      icon: <Github size={20} />,
      title: 'GitHub',
      detail: 'zaq-ly',
      link: 'https://github.com/zaq-ly',
    },
    {
      icon: <Linkedin size={20} />,
      title: 'LinkedIn',
      detail: 'Muhammad Zaqly Luluang',
      link: 'https://www.linkedin.com/in/muhammad-zaqly-luluang-468a61327/',
    },
    {
      icon: <Instagram size={20} />,
      title: 'Instagram',
      detail: '@zqlyy_',
      link: 'https://www.instagram.com/zqlyy_/',
    },
  ];

  return (
    <section id="contact" className="section-padding bg-primary">
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn direction="up">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-4">
            Kontak.
          </h2>
          <p className="text-lg text-text-secondary font-medium mb-12">
            Mari berkolaborasi dan ciptakan sesuatu yang luar biasa bersama.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {contacts.map((item, index) => (
            <FadeIn key={index} delay={index * 0.1} direction="up" distance={30}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/50 hover:shadow-soft transition-all hover:-translate-y-1"
              >
                <div className="text-text-primary">
                  {item.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs text-text-secondary font-medium">{item.title}</p>
                  <p className="text-sm font-semibold text-text-primary truncate">{item.detail}</p>
                </div>
                <ArrowUpRight size={16} className="text-text-tertiary group-hover:text-text-primary transition-colors" />
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
