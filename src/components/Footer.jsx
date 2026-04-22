import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: <Github size={20} />, href: 'https://github.com/zaq-ly' },
    { icon: <Linkedin size={20} />, href: '#' },
    { icon: <Twitter size={20} />, href: '#' },
    { icon: <Mail size={20} />, href: 'mailto:zaqly@example.com' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-12 transition-colors">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <a href="#home" className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            EMZEDEL
          </a>
          <p className="text-secondary dark:text-gray-400 mt-2">
            Building digital experiences that matter.
          </p>
        </div>

        <div className="flex space-x-6">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-6 mt-8 pt-8 border-t dark:border-gray-800 text-center text-sm text-secondary dark:text-gray-500">
        <p>&copy; {new Date().getFullYear()} EMZEDEL. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
