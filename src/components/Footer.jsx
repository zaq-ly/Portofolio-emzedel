import React from 'react';
import { Mail, Github, Linkedin, Instagram, Lock, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: <Github size={18} />, href: 'https://github.com/', label: 'GitHub' },
    { icon: <Linkedin size={18} />, href: 'https://www.linkedin.com/in/muhammad-zaqly-luluang-468a61327/', label: 'LinkedIn' },
    { icon: <Instagram size={18} />, href: 'https://www.instagram.com/zqlyy_/', label: 'Instagram' },
    { icon: <Mail size={18} />, href: 'mailto:muhammadzaqly01@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="relative bg-primary text-white">
      {/* Marquee */}
      <div className="w-full overflow-hidden border-y border-white/10 py-4">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 mr-8 items-center">
              <span className="text-sm font-medium tracking-[0.2em] uppercase opacity-40">Front-End Development</span>
              <span className="text-white/20">◆</span>
              <span className="text-sm font-medium tracking-[0.2em] uppercase opacity-40">UI/UX Design</span>
              <span className="text-white/20">◆</span>
              <span className="text-sm font-medium tracking-[0.2em] uppercase opacity-40">Design & Ilustrasi</span>
              <span className="text-white/20">◆</span>
              <span className="text-sm font-medium tracking-[0.2em] uppercase opacity-40">Creative Developer</span>
              <span className="text-white/20">◆</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Left — Brand */}
          <div>
            <a href="#home" className="font-display text-2xl font-bold tracking-tight">
              <span className="text-accent">MZ</span>L
            </a>
            <p className="text-white/50 text-sm mt-2 max-w-xs">
              Creative Developer — Mendesain, mengilustrasikan, dan membangun pengalaman digital.
            </p>
          </div>

          {/* Right — Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60
                           hover:bg-white/10 hover:text-white hover:border-white/20
                           transition-all duration-200"
                title={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Muhammad Zaqly Luluang. All rights reserved.
          </p>

          {/* Hidden admin link */}
          <a
            href="/admin"
            className="opacity-0 hover:opacity-100 transition-all duration-300 text-white/30 hover:text-white/60 text-xs"
            title="Admin"
          >
            <Lock size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
