import React from 'react';
import { Github, Linkedin, Instagram, Mail, Lock } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: <Github size={20} />, href: 'https://github.com/zaq-ly', label: 'GitHub' },
    { icon: <Linkedin size={20} />, href: 'https://www.linkedin.com/in/muhammad-zaqly-luluang-468a61327/', label: 'LinkedIn' },
    { icon: <Instagram size={20} />, href: 'https://www.instagram.com/zqlyy_/', label: 'Instagram' },
    { icon: <Mail size={20} />, href: 'mailto:muhammadzaqly01@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-dark-card border-t border-gray-100 dark:border-dark-border py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <a href="#/" className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Muhammad Zaqly Luluang
          </a>
          <p className="text-gray-500 mt-2 text-sm">
            Mengubah ide menjadi kisah visual.
          </p>
        </div>

        <div className="flex space-x-4">
          {/* ... social links ... */}
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark transition-all duration-300 hover:scale-110"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-8 border-t border-gray-100 dark:border-dark-border text-center relative">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Muhammad Zaqly Luluang. Hak Cipta Dilindungi.</p>

        {/* Pintu Rahasia Super Tersembunyi */}
        <a
          href="#/admin"
          className="absolute right-4 bottom-0 opacity-[0.05] hover:opacity-100 text-gray-400 hover:text-primary transition-all duration-700 text-[8px] uppercase tracking-[0.3em] font-bold py-2"
          title="Admin Access"
        >
          <Lock size={8} className="inline mr-1" />
          EMZEDEL
        </a>
      </div>
    </footer>
  );
};



export default Footer;
